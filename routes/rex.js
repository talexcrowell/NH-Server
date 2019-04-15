'use strict'; 

const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/movies', (req, res, next) => {
  return axios.get('https://api.themoviedb.org/3/movie/top_rated?api_key=70b1183c942fb1a783d79c4ba8ef2b2f&language=en-US')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
});

module.exports = router;