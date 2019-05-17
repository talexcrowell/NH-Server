'use strict';

require('dotenv').config(); 

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  DATABASE_URL:
    process.env.DATABASE_URL || 'mongodb://localhost:27017/project',
  
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test', 

  JWT_SECRET : process.env.JWT_SECRET || 'REPLACE_ME!!!!', 
  JWT_EXPIRY : process.env.JWT_EXPIRY || '7d',
  IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID,
  MOVIEDB_API_KEY: process.env.MOVIEDB_API_KEY,
  NEWSAPI_CLIENT_ID: process.env.NEWSAPI_CLIENT_ID,
  GIPHY_API_KEY: process.env.GIPHY_API_KEY,
  VIMEO_CLIENT_TOKEN: process.env.VIMEO_CLIENT_TOKEN,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  DEVIANTART_CLIENT_ID: process.env.DEVIANTART_CLIENT_ID,
  DEVIANTART_CLIENT_SECRET: process.env.DEVIANTART_CLIENT_SECRET
};