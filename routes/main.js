'use strict'; 

const express = require('express');
const axios=require('axios');
const NewsAPI = require('newsapi');

const  {standardizeImgurData, standardizeRedditData, standardizeNewsAPIData} = require('../utils/standardize');
const { IMGUR_CLIENT_ID, NEWSAPI_CLIENT_ID } = require('../config');

const router = express.Router();
const newsapi = new NewsAPI(NEWSAPI_CLIENT_ID);

//retrieving data for general feed
router.get('/general', (req, res, next) => {
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
      let output = [];
      let stdGen = standardizeNewsAPIData(general, 'General');
      let stdTech = standardizeNewsAPIData(tech, 'Technology');
      let stdSci = standardizeNewsAPIData(sci, 'Science');
      let stdBus = standardizeNewsAPIData(business, 'Business');
      let stdHealth = standardizeNewsAPIData(health, 'Health');
      let i=0;
  //while loading output response to length (100), check if article has already been loaded before to avoid copies 
      while(output.length < 100){
        // general news check
        if (output.filter((article) => stdGen[i].url === article.url).length === 0){
          output.push(stdGen[i]);
        }
        // tech news check
        if (output.filter((article) => stdTech[i].url === article.url).length === 0){
          output.push(stdTech[i]);
        }
        // science news check
        if (output.filter((article) => stdSci[i].url === article.url).length === 0){
          output.push(stdSci[i]);
        }
        // business news check
        if (output.filter((article) => stdBus[i].url === article.url).length === 0){
          output.push(stdBus[i]);
        }
        // health news check
        if (output.filter((article) => stdHealth[i].url === article.url).length === 0){
          output.push(stdHealth[i]);
        }
        // increase array position for next round
        i += 1;
      }
      // sort by release date and time
      output.sort((a,b)=> new Date(b.date + ' '+ b.time) - new Date(a.date + ' '+ a.time))
      res.json(output)
    })
    .then(data => res.json(data))
    .catch(err => next(err)); 
});

module.exports = router;