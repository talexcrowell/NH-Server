'use strict'; 

const express = require('express');
const router = express.Router();
const axios=require('axios');
const { IMGUR_CLIENT_ID , GIPHY_API_KEY} = require('../config');
const  {standardizeImgurData, standardizeRedditData, standardizeGiphyData} = require('../utils/standardize');

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

// test NeighborHound imgur response endpoint
router.get('/giphy', (req, res, next) => {
  return axios.get(`http://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=50;`)
    .then(results => standardizeGiphyData(results.data))
    .then(data => res.send(data))
    .catch(err => next(err));
});

// community all endpoint
router.get('/all', (req, res, next) => {
  return axios.all([axios.get('https://api.imgur.com/3/gallery/hot', {'headers': {Accept: 'application/json', 'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`}}), 
    axios.get('https://www.reddit.com/r/all.json?count=50'),
    axios.get(`http://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=50;`)
  ])
    .then(axios.spread((imgurRes, redditRes, giphyRes) => {
      let output =[];
      let imgurData = standardizeImgurData(imgurRes.data);
      let redditData = standardizeRedditData(redditRes.data.data);
      let giphyData = standardizeGiphyData(giphyRes.data);
      for(let i=0; i < 25; i++ ){
        output.push(imgurData[i]);
        output.push(redditData[i]);
        output.push(giphyData[i]);
      }
      return output;
    }))
    .then(data => res.send(data))
    .catch(err => next(err));
});

module.exports = router;