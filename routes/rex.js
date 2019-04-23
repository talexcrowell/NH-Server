'use strict'; 

const express = require('express');
const router = express.Router();
const knex = require('../db/knex/knex');
const axios=require('axios');
const { MOVIEDB_API_KEY } = require('../config');

function standardizeMovieDBTVData(data){
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
    let url = `https://www.themoviedb.org/tv/${item.id}`;
    let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}`;
    return {
      title: item.name,
      movieDbId: item.id,
      movieDbrating: item.vote_average,
      url,
      language: item.original_language,
      released: item.first_air_date,
      img, 
      overview: item.overview,
      genres,
    };
  });
}

function standardizeMovieDBMovieData(data){
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
    let url = `https://www.themoviedb.org/tv/${item.id}`;
    let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}`;
    return {
      title: item.title,
      movieDbId: item.id,
      movieDbrating: item.vote_average,
      url,
      language: item.original_language,
      released: item.release_date,
      img, 
      overview: item.overview,
      genres,
    };
  });
}


// adds response to database
router.get('/adadasdasdasd', (req, res ,next) => {
  return axios.all([
    axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${MOVIEDB_API_KEY}&page=1&region=US`),
    axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${MOVIEDB_API_KEY}&page=2&region=US`),
    axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${MOVIEDB_API_KEY}&page=3&region=US`)
  ])
    .then(axios.spread((results1, results2, results3) => {
      let output = [];
      let std1 = standardizeMovieDBTVData(results1.data);
      let std2 = standardizeMovieDBTVData(results2.data);
      let std3 = standardizeMovieDBTVData(results3.data);
      output = [...std1, ...std2, ...std3];

      return output;
    }))
    .then(data => {
      let output = [];
      for(let i=0; i < data.length; i++){
        let insertData = {
          title: data[i].title,
          moviedbid: data[i].movieDbId.toString(),
          moviedbrating: data[i].movieDbrating.toString(),
          url: data[i].url,
          released: data[i].released,
          img: data[i].img, 
          overview: data[i].overview,
          language: data[i].language,
          genres: 'filler'
        };
        output.push(insertData);
      }
      console.log('Added: '+ data.length + ' entries to movies table');
      return knex.insert(output).into('shows');
    })
    .then(() => res.json({Message: 'Movie table updated'}))
    .catch(err => next(err));
});

//quick api points

router.get('/retrievemovies', (req, res ,next) => {
  knex.select().from('movies')
    .then(results => res.json(results));
});

router.get('/retrieveshows', (req, res ,next) => {
  knex.select().from('shows')
    .then(results => res.json(results));
});


//
router.get('/quickrec', (req, res ,next) => {
  let randomInt = Math.floor(Math.random()*9000)+1;
  if(randomInt % 2 === 0){
    return knex.select().from('movies').orderByRaw('RANDOM()')
      .then(results => res.json(results[0]));
  }
  else{
    return knex.select().from('shows').orderByRaw('RANDOM()')
      .then(results => res.json(results[0]));
  }

});

router.get('/catalog', (req, res ,next) => {
  Promise.all([
    knex.select().from('movies'),
    knex.select().from('shows')
  ])
    .then(([movieRes, tvRes]) => {
      let output = [...movieRes, ...tvRes];
      return output.sort((a,b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0);
    })
    .then(data => res.json(data))
    .catch(err => next(err));
});

router.get('/upcoming', (req, res ,next) => {
  axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${MOVIEDB_API_KEY}&page=1&region=US`)
    .then(results => standardizeMovieDBMovieData(results.data))
    .then(data => res.json(data));
});

router.get('/schedule', (req, res ,next) => {
  axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${MOVIEDB_API_KEY}&page=1&region=US`)
    .then(results => standardizeMovieDBTVData(results.data))
    .then(data => res.json(data));
});

module.exports = router;
