'use strict';
const knex = require('../db/knex/knex');
const axios=require('axios');
const { MOVIEDB_API_KEY } = require('../config');
const {standardizeMovieDBTVMini} = require('./standardize');

/**  
 * Requests information from MovieDB API based on number of entries and adds them to database(PostgreSQL) in a standardized structure
 * 
*/
function seedDBmini(start, end=(start+15)){
  let promisified = [];
  for(let i=start; i< end; i++){
    promisified.push(axios.get(`https://api.themoviedb.org/3/tv/${i}?api_key=${MOVIEDB_API_KEY}`));
  } 
  return Promise.all(promisified)
    .then(results => {
      console.log('hit!');
      let output = standardizeMovieDBTVMini(results);
      console.log('Added: '+ output.length + ' entries to Shows table');
      return knex.insert(output).into('shows');
    })
    .then(() =>{
      console.log({Message: `Shows updated starting at id:${start} and ending at id:${end}`});
      return;
    })
    .catch(err => console.log(err));
}

seedDBmini(102);

