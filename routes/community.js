'use strict'; 

const express = require('express');
const router = express.Router();
const axios=require('axios');
const { IMGUR_CLIENT_ID } = require('../config');

function standardizeImgurData(results){
  return results.data.map(item => {
    let img;
    let tag;
    if(item.images){
      let imgArr = item.images[0];
      img = imgArr.link;
    }
    if(item.tags.length > 0){
      let tagsArr = item.tags[0];
      tag = tagsArr.name;

      //capitalize
      // let charCode = tag.charCodeAt(0);
      // tag.replace(String.fromCharCode(charCode), String.fromCharCode((charCode-32)));
    }
    else{
      tag='';
    }
    return {
      url: item.link,
      title: item.title,
      img, 
      publishedAt: item.datetime,
      category: tag,
      source: 'imgur'
    };
  });
}

function standardizeRedditData(results){
  return results.data.children.map(item => {
    let url;
    url = 'https://www.reddit.com/'+item.data.permalink;
    return {
      url,
      title: item.data.title,
      img: item.data.url, 
      publishedAt: item.data.created_utc,
      category: item.data.subreddit_name_prefixed,
      source: 'reddit'
    };
  });
}

//retrieve reddit RSS and convert it into JSON 
router.get('/reddit', (req, res ,next) => {
  return axios.get('https://www.reddit.com/r/all.json')
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
      let redditData = standardizeRedditData(redditRes.data);
      output = [...imgurData, ...redditData];
      return output.sort(function(a, b) {
        return a.publishedAt > b.publishedAt ? -1 : a.publishedAt < b.publishedAt ? 1 : 0;
      });
    }))
    .then(data => res.send(data))
    .catch(err => next(err));
});

module.exports = router;