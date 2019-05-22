'use strict'; 

const express = require('express');
const router = express.Router();
const axios=require('axios');
const { IMGUR_CLIENT_ID , GIPHY_API_KEY, VIMEO_CLIENT_TOKEN, YOUTUBE_API_KEY, DEVIANTART_CLIENT_ID, DEVIANTART_CLIENT_SECRET} = require('../config');
const  {standardizeImgurData, standardizeRedditData, standardizeGiphyData, standardizeGfycatData, standardizeVimeoData, standardizeYoutubeData, standardizeDeviantArtData} = require('../utils/standardize');

// test NeighborHound reddit response endpoint
router.get('/reddit', (req, res ,next) => {
  return axios.get('https://www.reddit.com/r/all.json?limit=50')
    .then(response => response.data)
    .then(results => standardizeRedditData(results.data))
    .then(data => res.send(data))
    .catch(err => next(err));
});

// test NeighborHound imgur response endpoint
router.get('/imgur', (req, res, next) => {
  return axios.get('https://api.imgur.com/3/gallery/hot', {  
    'headers': {
      Accept: 'application/json',
      'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
    }
  })
    .then(results => standardizeImgurData(results.data))
    .then(data => res.send(data))
    .catch(err => next(err));
});

// test NeighborHound giphy response endpoint
router.get('/giphy', (req, res, next) => {
  return axios.get(`http://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=50;`)
    // .then(results => standardizeGiphyData(results.data))
    .then(data => res.send(data.data))
    .catch(err => next(err));
});

// test NeighborHound gfycat response endpoint
router.get('/gfycat', (req, res ,next) => {
  return axios.get('https://api.gfycat.com/v1/gfycats/trending?count=25')
    .then(results => standardizeGfycatData(results.data))
    .then(data => res.send(data))
    .catch(err => next(err));
});

// test NeighborHound vimeo response endpoint
router.get('/vimeo', (req, res ,next) => {
  return axios.get('https://api.vimeo.com/videos?filter=trending',{
    'method': 'GET',
    'headers': {
      Accept: 'application/json',
      'Authorization': `Bearer ${VIMEO_CLIENT_TOKEN}`
    }
  })
    .then(results => standardizeVimeoData(results.data))
    .then(data => res.send(data))
    .catch(err => next(err));
});

// test NeighborHound youtube response endpoint
router.get('/youtube', (req, res, next) => {
  return axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US&key=${YOUTUBE_API_KEY}`)
    .then(results => standardizeYoutubeData(results.data))
    .then(data => res.send(data))
    .catch(err => next(err));
});

// test NeighborHound deviant art response endpoint
router.get('/deviantart', (req, res, next) => {
  axios.get(`https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=${DEVIANTART_CLIENT_ID}&client_secret=${DEVIANTART_CLIENT_SECRET}`)
    .then(results => axios.get(`https://www.deviantart.com/api/v1/oauth2/browse/hot?access_token=${results.data.access_token}&limit=25`))
    .then(results => standardizeDeviantArtData(results.data))
    .then(data => res.send(data))
    .catch(err => next(err));
});

// community all endpoint
router.get('/all', (req, res, next) => {
  return axios.get(`https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=${DEVIANTART_CLIENT_ID}&client_secret=${DEVIANTART_CLIENT_SECRET}`)
    .then(results => {
      return axios.all([axios.get('https://api.imgur.com/3/gallery/hot', {'headers': {Accept: 'application/json', 'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`}}), 
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
    .then(axios.spread((imgurRes, redditRes, vimeoRes, gfycatRes, youtubeRes, daRes) => {
      let output =[];
      let imgurData = standardizeImgurData(imgurRes.data);
      let redditData = standardizeRedditData(redditRes.data.data);
      let vimeoData = standardizeVimeoData(vimeoRes.data);
      let gfycatData = standardizeGfycatData(gfycatRes.data);
      let youtubeData = standardizeYoutubeData(youtubeRes.data);
      let daData = standardizeDeviantArtData(daRes.data);
      for(let i=0; i < 20; i++ ){
        output.push(redditData[i]);
        output.push(youtubeData[i]);
        output.push(imgurData[i]);
        output.push(vimeoData[i]);
        output.push(gfycatData[i]);
        output.push(daData[i]);
      }
      return output;
    }))
    .then(data => res.send(data))
    .catch(err => next(err));
});

router.post('/search', (req, res, next) => {
  let {query, source, nsfw} = req.body;
  console.log(query, source, nsfw);
  switch(source){
  case 'reddit':
    axios.get('https://www.reddit.com/r/all.json?limit=50')
      .then(response => response.data)
      .then(results => standardizeRedditData(results.data))
      .then(data => res.send(data))
      .catch(err => next(err));
    break;
  case 'youtube':
    axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US&key=${YOUTUBE_API_KEY}`)
      .then(results => standardizeYoutubeData(results.data))
      .then(data => res.send(data))
      .catch(err => next(err));
    break;
  case 'imgur':
    axios.get('https://api.imgur.com/3/gallery/hot', {  
      'headers': {
        Accept: 'application/json',
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
      }
    })
      .then(results => standardizeImgurData(results.data))
      .then(data => res.send(data))
      .catch(err => next(err));
    break;
  case 'vimeo':
    axios.get('https://api.vimeo.com/videos?filter=trending',{
      'method': 'GET',
      'headers': {
        Accept: 'application/json',
        'Authorization': `Bearer ${VIMEO_CLIENT_TOKEN}`
      }
    })
      .then(results => standardizeVimeoData(results.data))
      .then(data => res.send(data))
      .catch(err => next(err));
    break;
  case 'gfycat':
    axios.get('https://api.gfycat.com/v1/gfycats/trending?count=25')
      .then(results => standardizeGfycatData(results.data))
      .then(data => res.send(data))
      .catch(err => next(err));
    break;
  case 'deviantart':
    axios.get(`https://www.deviantart.com/oauth2/token?grant_type=client_credentials&client_id=${DEVIANTART_CLIENT_ID}&client_secret=${DEVIANTART_CLIENT_SECRET}`)
      .then(results => axios.get(`https://www.deviantart.com/api/v1/oauth2/browse/hot?access_token=${results.data.access_token}&limit=25`))
      .then(results => standardizeDeviantArtData(results.data))
      .then(data => res.send(data))
      .catch(err => next(err));
    break;   
  }
});

module.exports = router;