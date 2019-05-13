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
  IMGUR_CLIENT_ID: '8668a1f48886476',
  MOVIEDB_API_KEY: '70b1183c942fb1a783d79c4ba8ef2b2f',
  NEWSAPI_CLIENT_ID: 'dc03dbc112374dcdac916e01ee3788de',
  GIPHY_API_KEY: 'qHPWjY20IQQGCLW2LrKDR9tqU0ZRocrs'
};