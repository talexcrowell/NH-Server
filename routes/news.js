'use strict'; 

const express = require('express');
const router = express.Router();
const axios = require('axios');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('dc03dbc112374dcdac916e01ee3788de');
const {standardizeNewsAPIData} = require('../utils/standardize');


//retrieve top US headlines
router.get('/us', (req, res, next) => {
  newsapi.v2.topHeadlines({
    language: 'en',
    country: 'us'
  })
    .then(results => standardizeNewsAPIData(results))
    .then(data => res.json(data))
    .catch(err => next(err)); 
});

//hacky gathering of news of different categories
router.get('/general', (req, res, next) => {
  return Promise.all([
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
    .then(([tech, sci, business, health])=> {
      let output = [];
      let stdTech = standardizeNewsAPIData(tech, 'Technology');
      let stdSci = standardizeNewsAPIData(sci, 'Science');
      let stdBus = standardizeNewsAPIData(business, 'Business');
      let stdHealth = standardizeNewsAPIData(health, 'Health');
      for(let i=0; i<25; i++){
        output.push(stdTech[i]);
        output.push(stdSci[i]);
        output.push(stdBus[i]);
        output.push(stdHealth[i]);
      }
      console.log(output.length);
      res.json(output)
    })
    .then(data => res.json(data))
    .catch(err => next(err)); 
});

//retrieve cybersecurity news
router.get('/cybersecurity', (req, res ,next) => {
  return axios.get('https://feed2json.org/convert?url=https://latesthackingnews.com/feed/')
    .then(results => res.json(results.data.items))
    .catch(err => next(err));
});

module.exports = router;