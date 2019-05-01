'use strict'; 

const express = require('express');
const router = express.Router();
const knex = require('../db/knex/knex');
const axios=require('axios');
const {standardizeMovieDBTVData, standardizeMovieDBTVDetailsData, standardizeMovieDBTVShowDetailsData, standardizeMovieDBMovieData} = require ('../utils/standardize');
const { MOVIEDB_API_KEY } = require('../config');

function extractIdsAndPageNumber(data){
  let ids = data.results.map(item => {
    return item.id;
  });

  return { page: data.page, total: data.total_pages, ids: [...ids]};
}

function hydrateGenresArray(data){
  return data.map(show => {
    let genres =[];
    if(show.genre0 !== null){
      genres.push({name: show.genre0});
    }
    if(show.genre1 !== null){
      genres.push({name: show.genre1});
    }
    if(show.genre2 !== null){
      genres.push({name: show.genre2});
    }
    return{
      id: show.id,
      moviedbid: show.moviedbid,
      title: show.title,
      img: show.img, 
      type: show.type,
      country: show.country,
      genres
    };
  });
}

//quick reference db endpoints

router.get('/retrievemovies', (req, res ,next) => {
  knex.select().from('movies')
    .then(results => res.json(results));
});

router.get('/retrieveshows', (req, res ,next) => {
  knex.select().from('shows')
    .then(results => res.json(results));
});


//functional endpoints POSTGRES
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
  return knex.select().from('shows')
    .then(results => hydrateGenresArray(results))
    .then(data => res.json(data))
    .catch(err => next(err));
  // Promise.all([
  //   knex.select().from('movies'),
  //   knex.select().from('shows')
  // ])
  //   .then(([movieRes, tvRes]) => {
  //     let output = [...movieRes, ...tvRes];
  //     return output.sort((a,b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0);
  //   })
  //   .then(data => res.json(data))
  //   .catch(err => next(err));
});

// endpoints to APIs
//  movie enpoints
router.get('/upcoming', (req, res ,next) => {
  axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${MOVIEDB_API_KEY}&page=1&region=US`)
    .then(results => standardizeMovieDBMovieData(results.data))
    .then(data => res.json(data));
});

router.get('/nowplaying', (req, res ,next) => {
  axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${MOVIEDB_API_KEY}&page=1&language=en-US`)
    .then(results => standardizeMovieDBMovieData(results.data))
    .then(data => res.json(data));
});

//  tv end points
router.get('/airingtoday', (req, res ,next) => {
  axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${MOVIEDB_API_KEY}&language=en-US&page=1`)
    .then(data => extractIdsAndPageNumber(data.data))
    .then(ids => {
      let promisified = ids.ids.map(id => axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${MOVIEDB_API_KEY}`));
      return Promise.all(promisified)
        .then((details) => {
          let output = [];
          for(let i=0; i< details.length; i++){
            output.push(details[i].data);
          }
          return standardizeMovieDBTVDetailsData(output);
        })
        .then(data => {
          let response = {
            page: ids.page,
            totalPages: ids.total,
            data: [...data]
          };
          res.json(response);
        })
        .catch(err => next(err));
    });
});

router.get('/schedule', (req, res ,next) => {  
  axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${MOVIEDB_API_KEY}&language=en-US&page=1`)
    .then(data => extractIdsAndPageNumber(data.data))
    .then(ids => {
      let promisified = ids.ids.map(id => axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${MOVIEDB_API_KEY}`));
      return Promise.all(promisified)
        .then((details) => {
          let output = [];
          for(let i=0; i< details.length; i++){
            output.push(details[i].data);
          }
          return standardizeMovieDBTVDetailsData(output);
        })
        .then(data => {
          let response = {
            page: ids.page,
            totalPages: ids.total,
            data: [...data]
          };
          
          res.json(response);
        })
        .catch(err => next(err));
    });
});

router.post('/tv/details', (req, res ,next) => { 
  let {id, type} = req.body;
  console.log(id);
  axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${MOVIEDB_API_KEY}&append_to_response=videos`)
    .then(results => standardizeMovieDBTVShowDetailsData(results.data))
    .then(data => res.json(data))
    .catch(err => next(err));
});

//  utility endpoints
router.post('/changepage', (req, res, next) => {
  let { reqPage, schedule } = req.body;
  console.log(schedule);
  if(schedule === 'today' ){
    axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${MOVIEDB_API_KEY}&language=en-US&page=${reqPage}&limit=15`)
      .then(data => extractIdsAndPageNumber(data.data))
      .then(ids => {
        let promisified = ids.ids.map(id => axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${MOVIEDB_API_KEY}`));
        return Promise.all(promisified)
          .then((details) => {
            let output = [];
            for(let i=0; i< details.length; i++){
              output.push(details[i].data);
            }
            return standardizeMovieDBTVDetailsData(output);
          })
          .then(data => {
            let response = {
              page: ids.page,
              totalPages: ids.total,
              data: [...data],
              schedule: schedule
            };
            res.json(response);
          })
          .catch(err => next(err));
      });
  }
  else if(schedule === 'ontheair' ){
    axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${MOVIEDB_API_KEY}&language=en-US&page=${reqPage}`)
      .then(data => extractIdsAndPageNumber(data.data))
      .then(ids => {
        let promisified = ids.ids.map(id => axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${MOVIEDB_API_KEY}`));
        return Promise.all(promisified)
          .then((details) => {
            let output = [];
            for(let i=0; i< details.length; i++){
              output.push(details[i].data);
            }
            return standardizeMovieDBTVDetailsData(output);
          })
          .then(data => {
            let response = {
              page: ids.page,
              totalPages: ids.total,
              data: [...data],
              schedule: schedule
            };
            res.json(response);
          })
          .catch(err => next(err));
      });
  }
});

router.get('/detailstest', (req, res ,next) => {
  axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${MOVIEDB_API_KEY}&append_to_response=next_episode_to_air`)
    .then(data => extractIdsAndPageNumber(data.data))
    .then(ids => {
      console.log(ids);
      let promisified = ids.ids.map(id => axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${MOVIEDB_API_KEY}&append_to_response=videos,images`));
      return Promise.all(promisified)
        .then((details) => {
          let output = [];
          for(let i=0; i< details.length; i++){
            output.push(details[i].data);
          }
          return output;
        })
        .then(results => standardizeMovieDBTVDetailsData(results))
        .then(data => {
          let response = {
            page: ids.page,
            totalPages: ids.total,
            data: [...data]
          };
          res.json(response);
        });
    });

});

module.exports = router;
