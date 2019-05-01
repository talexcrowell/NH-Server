'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgresql://postgres:P2asswor2d@localhost/neighborhound',
    debug: true, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  test: {
    client:'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgresql://dev:P2asswor2d@localhost:5432/neighborhound-test',
    pool: { min: 1, max: 2 }
  }
};