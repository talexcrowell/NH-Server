'use strict'; 

const express = require('express');
const router = express.Router();
const axios=require('axios');
const { IMGUR_CLIENT_ID } = require('../config');

function standardizeImgurData(results){
  return results.data.map(item => {
    let img;
    if(item.images){
      let imgArr = item.images[0];
      img = imgArr.link;
    }
    return{
      url: item.link,
      title: item.title,
      img: img, 
      publishedAt: item.datetime,
      source: 'imgur.com'
    }
  })
}

//retrieve reddit RSS and convert it into JSON 
router.get('/ss', (req, res ,next) => {
  return axios.get('https://feed2json.org/convert?url=https://www.reddit.com/r/all.rss')
    .then(results => results.data.items.map(item => {
      // let regex = /src=".*.jpg" alt/g;
      // let imageStr = regex.exec(item.content_html);
      // console.log(imageStr[0].replace('src=', '').replace('alt', ''));
      return{
        url: item.url,
        title: item.title,
        content_html: item.content_html,
        publishedAt: item.date_published
      };
    }))
    .then(results => res.json(results))
    .catch(err => next(err));
});

router.get('/all', (req, res, next) => {
  return axios.get('https://api.imgur.com/3/gallery/hot', {  
    'headers': {
      'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
    }
  })
  .then(results => standardizeImgurData(results.data))
  .then(data => res.json(data))
  .catch(err => next(err));
})

module.exports = router;