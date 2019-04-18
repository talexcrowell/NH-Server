'use strict'; 

const express = require('express');
const router = express.Router();
const knex = require('../db/knex/knex');
const axios=require('axios');
const { MOVIEDB_API_KEY } = require('../config');

function standardizeMovieDBData(data){
  return data.results.map(item => {
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
    let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}`;
    return {
      title: item.title,
      source: 'MovieDB',
      sourceItemId: item.id,
      url,
      language: item.original_language,
      released: item.release_date,
      img, 
      overview: item.overview,
      genres,
    };
  });
}

router.get('/', (req, res ,next) => {
  return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${MOVIEDB_API_KEY}&language=en-US&page=1`)
    .then(results => standardizeMovieDBData(results.data))
    .then(data => {
      let output = [];
      for(let i=0; i < data.length; i++){
        let insertData = {
          title: data[i].title,
          source: 'MovieDB',
          sourceitemid: data[i].sourceItemId.toString(),
          url: data[i].url,
          released: data[i].released,
          img: data[i].img, 
          overview: data[i].overview,
          language: data[i].language
        };
        output.push(insertData);
      }
      console.log('Added: '+ data.length + ' entries to movies table');
      return knex.insert(output).into('movies');
    })
    .then(() => res.json({Message: 'Movie table updated'}))
    .catch(err => next(err));
});

router.get('/retrieve', (req, res ,next) => {
  knex.select().from('movies')
    .then(results => res.json(results));
});

module.exports = router;
