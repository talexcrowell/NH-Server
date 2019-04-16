'use strict'; 

const express = require('express');
const router = express.Router();
const axios=require('axios');

//retrieve reddit RSS and convert it into JSON 
router.get('/', (req, res ,next) => {
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

module.exports = router;