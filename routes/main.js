'use strict'; 

const express = require('express');
const axios=require('axios');
const NewsAPI = require('newsapi');

const  {standardizeImgurData, standardizeRedditData, standardizeNewsAPIData, standardizeVimeoData, standardizeGfycatData, standardizeYoutubeData, standardizeDeviantArtData} = require('../utils/standardize');
const { IMGUR_CLIENT_ID, NEWSAPI_CLIENT_ID, VIMEO_CLIENT_TOKEN, YOUTUBE_API_KEY, DEVIANTART_CLIENT_ID, DEVIANTART_CLIENT_SECRET} = require('../config');

const router = express.Router();
const newsapi = new NewsAPI(NEWSAPI_CLIENT_ID);

//retrieving data for general feed
router.get('/', (req, res, next) => {
  return axios.get(`https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=${DEVIANTART_CLIENT_ID}&client_secret=${DEVIANTART_CLIENT_SECRET}`)
    .then(results => {
      return Promise.all([ 
        newsapi.v2.topHeadlines({
          language: 'en',
          country: 'us',
          category: 'general',
          pageSize: 25
        }),
        newsapi.v2.topHeadlines({
          language: 'en',
          country: 'us',
          category: 'technology',
          pageSize: 25
        }),
        newsapi.v2.topHeadlines({
          language: 'en',
          country: 'us',
          category: 'science',
          pageSize: 25
        }),
        newsapi.v2.topHeadlines({
          language: 'en',
          country: 'us',
          category: 'business',
          pageSize: 25
        }),
        newsapi.v2.topHeadlines({
          language: 'en',
          country: 'us',
          category: 'health',
          pageSize: 25
        }),
        axios.get('https://api.imgur.com/3/gallery/hot', {'headers': {Accept: 'application/json', 'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`}}), 
        axios.get('https://www.reddit.com/r/all.json?count=50'),
        axios.get('https://api.vimeo.com/videos?filter=trending',{
          'method': 'GET',
          'headers': {
            Accept: 'application/json',
            'Authorization': `Bearer ${VIMEO_CLIENT_TOKEN}`
          }
        }),
        axios.get('https://api.gfycat.com/v1/gfycats/trending?count=25'),
        axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US&key=${YOUTUBE_API_KEY}`),
        axios.get(`https://www.deviantart.com/api/v1/oauth2/browse/hot?access_token=${results.data.access_token}&limit=25`)
      ]);
    })
  //hacky distribution of articles
    .then(([general, tech, sci, business, health, imgur, reddit, vimeo, gfycat, youtube, deviantart])=> {
      let newsArr = [];
      let output = [];
      let stdGen = standardizeNewsAPIData(general, 'General');
      let stdTech = standardizeNewsAPIData(tech, 'Technology');
      let stdSci = standardizeNewsAPIData(sci, 'Science');
      let stdBus = standardizeNewsAPIData(business, 'Business');
      let stdHealth = standardizeNewsAPIData(health, 'Health');
      let stdReddit = standardizeRedditData(reddit.data.data);
      let stdImgur = standardizeImgurData(imgur.data);
      let stdVimeo = standardizeVimeoData(vimeo.data);
      let stdGfycat = standardizeGfycatData(gfycat.data);
      let stdYoutube = standardizeYoutubeData(youtube.data);
      let stdDeviantart = standardizeDeviantArtData(deviantart.data);
      let i=0;

      //while loading output response to length (100), check if article has already been loaded before to avoid copies 
      while(newsArr.length < 100){
        // general news check
        if (newsArr.filter((article) => stdGen[i].url === article.url).length === 0){
          newsArr.push(stdGen[i]);
        }
        // tech news check
        if (newsArr.filter((article) => stdTech[i].url === article.url).length === 0){
          newsArr.push(stdTech[i]);
        }
        // science news check
        if (newsArr.filter((article) => stdSci[i].url === article.url).length === 0){
          newsArr.push(stdSci[i]);
        }
        // business news check
        if (newsArr.filter((article) => stdBus[i].url === article.url).length === 0){
          newsArr.push(stdBus[i]);
        }
        // health news check
        if (newsArr.filter((article) => stdHealth[i].url === article.url).length === 0){
          newsArr.push(stdHealth[i]);
        }
        // increase array position for next round
        i += 1;
      }
      // sort news by release date and time (community already sorted to trending)
      newsArr.sort((a,b)=> new Date(b.date + ' '+ b.time) - new Date(a.date + ' '+ a.time));
      
      //loading community content into single array
      let commArr = [];
      for(let i=0; i < 20; i++ ){
        commArr.push(stdReddit[i]);
        commArr.push(stdYoutube[i]);
        commArr.push(stdImgur[i]);
        commArr.push(stdVimeo[i]);
        commArr.push(stdGfycat[i]);
        commArr.push(stdDeviantart[i]);
      }
      
      //hacky 1:1 add into output array (maybe user patterns?)
      for(let i=0; i < 75; i++){
        output.push(newsArr[i]);
        output.push(commArr[i]);
      } 
      return output;
    })
    .then(data => res.json(data))
    .catch(err => next(err)); 
});

module.exports = router;