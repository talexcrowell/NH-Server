'use strict'; 

const express = require('express');
const router = express.Router();
const axios=require('axios');
const { MOVIEDB_API_KEY } = require('../config');

function standardizeMovieDBData(results){
  return results.data.map(item => {
    let genres = [];
    let genreNumber ={
      '35': 'Comedy',
      '12': 'Adventure',
      '14': 'Fantasy'
    };

    if(item.genre_ids){
      for(let i=0; i < item.genre_ids.length; i++){
        genres.push(genreNumber[`${item.genre_ids[i]}`]);
      }
    }
    let url = `https://www.themoviedb.org/movie/${item.id}`;
    let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${item.poster_path}`
    return {
      url: item.link,
      title: item.title,
      img, 
      publishedAt: item.datetime,
      category: genres,
      source: 'imgur'
    };
  });
}

router.get('/', (req, res ,next) => {
  return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${MOVIEDB_API_KEY}&language=en-US&page=1`)
    .then(results => standardizeMovieDBData(results.data.results))
    .then(data => res.json(data))
    .catch(err => next(err));
});

module.exports = router;
