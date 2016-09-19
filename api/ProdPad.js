'use strict';

const HTTP = require('./HTTP');

/*
 * Facade to ProdPad API.
 */
module.exports = Config => { 
  return {
    Ideas: {
      get: ()=> 
        HTTP.getResponse({
          host: 'api.prodpad.com',
          path: `/v1/ideas?apikey=${Config.ProdPad.API_KEY}`,
          method: 'GET'
        })
        .then(body => JSON.parse(body)),
    },
    Statuses: {
      get: ()=> 
        HTTP.getResponse({
          host: 'api.prodpad.com',
          path: `/v1/statuses?apikey=${Config.ProdPad.API_KEY}`,
          method: 'GET'
        })
        .then(body => JSON.parse(body)),
    },
    Products: {
      get: ()=> 
        HTTP.getResponse({
          host: 'api.prodpad.com',
          path: `/v1/products?apikey=${Config.ProdPad.API_KEY}`,
          method: 'GET'
        })
        .then(body => JSON.parse(body)),
    },
    RoadMaps: {
      get: ()=> 
        HTTP.getResponse({
          host: 'api.prodpad.com',
          path: `/v1/roadmaps?apikey=${Config.ProdPad.API_KEY}`,
          method: 'GET'
        })
        .then(body => JSON.parse(body)),
    }
  };
};