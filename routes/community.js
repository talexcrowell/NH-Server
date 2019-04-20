'use strict'; 

const express = require('express');
const router = express.Router();
const axios=require('axios');
const { IMGUR_CLIENT_ID } = require('../config');
const  {standardizeImgurData, standardizeRedditData} = require('../utils/standardize');

// retrieve reddit JSON 
router.get('/reddit', (req, res ,next) => {
  return axios.get('https://www.reddit.com/r/all.json')
    .then(response => response.data)
    .then(results => standardizeRedditData(results.data))
    .then(data => res.send(data))
    .catch(err => next(err));
});

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

router.get('/all', (req, res, next) => {
  return axios.all([axios.get('https://api.imgur.com/3/gallery/hot', {'headers': {Accept: 'application/json', 'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`}
  }), axios.get('https://www.reddit.com/r/all.json')])
    .then(axios.spread((imgurRes, redditRes) => {
      let output =[];
      let imgurData = standardizeImgurData(imgurRes.data);
      let redditData = standardizeRedditData(redditRes.data.data);
      output = [...imgurData, ...redditData];
      return output.sort(function(a, b) {
        return a.publishedAt > b.publishedAt ? -1 : a.publishedAt < b.publishedAt ? 1 : 0;
      });
    }))
    .then(data => res.send(data))
    .catch(err => next(err));
});

module.exports = router;