'use strict'; 

const express = require('express');
const router = express.Router();
const axios = require('axios');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('dc03dbc112374dcdac916e01ee3788de');
const {standardizeNewsAPIData} = require('../utils/standardize');


//test endpoint
router.get('/test', (req, res, next) => {
  newsapi.v2.topHeadlines({
    language: 'en',
    country: 'us',
    category: 'general'
  })
    .then(results => standardizeNewsAPIData(results))
    .then(data => res.json(data))
    .catch(err => next(err)); 
});

//retrieving data for general feed
router.get('/articles', (req, res, next) => {
  return Promise.all([ 
    newsapi.v2.topHeadlines({
      language: 'en',
      country: 'us',
      category: 'general',
      pageSize: 50
    }),
    newsapi.v2.topHeadlines({
      language: 'en',
      country: 'us',
      category: 'technology',
      pageSize: 50
    }),
    newsapi.v2.topHeadlines({
      language: 'en',
      country: 'us',
      category: 'science',
      pageSize: 50
    }),
    newsapi.v2.topHeadlines({
      language: 'en',
      country: 'us',
      category: 'business',
      pageSize: 50
    }),
    newsapi.v2.topHeadlines({
      language: 'en',
      country: 'us',
      category: 'health',
      pageSize: 50
    })
  ])
  //hacky distribution of articles
    .then(([general, tech, sci, business, health])=> {
      let output = [];
      let stdGen = standardizeNewsAPIData(general, 'General');
      let stdTech = standardizeNewsAPIData(tech, 'Technology');
      let stdSci = standardizeNewsAPIData(sci, 'Science');
      let stdBus = standardizeNewsAPIData(business, 'Business');
      let stdHealth = standardizeNewsAPIData(health, 'Health');
      output = [...stdGen, ...stdTech, ...stdSci, ...stdBus, ...stdHealth];
      res.json(output);
    })
    .then(data => res.json(data))
    .catch(err => next(err)); 
});

//retrieving data for general feed
router.get('/all', (req, res, next) => {
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
    })
  ])
  //hacky distribution of articles
    .then(([general, tech, sci, business, health])=> {
      let newsArr = [];
      let output = [];
      let stdGen = standardizeNewsAPIData(general, 'General');
      let stdTech = standardizeNewsAPIData(tech, 'Technology');
      let stdSci = standardizeNewsAPIData(sci, 'Science');
      let stdBus = standardizeNewsAPIData(business, 'Business');
      let stdHealth = standardizeNewsAPIData(health, 'Health');

      let i=0;
      
      //loading community content into single array

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
      
      //hacky 1:1 add into output array (maybe user patterns?)
      for(let i=0; i < 75; i++){
        output.push(newsArr[i]);
      } 
      console.log('comm all', output.length);
      return output;
    })
    .then(data => res.json(data))
    .catch(err => next(err)); 
});

module.exports = router;