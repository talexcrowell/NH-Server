'use strict'; 

const express = require('express');
const router = express.Router();
const axios = require('axios');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('dc03dbc112374dcdac916e01ee3788de');
const {standardizeNewsAPIData} = require('../utils/standardize');


//retrieve top US headlines
router.get('/general', (req, res, next) => {
  newsapi.v2.topHeadlines({
    language: 'en',
    country: 'us'
  })
    .then(results => standardizeNewsAPIData(results))
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