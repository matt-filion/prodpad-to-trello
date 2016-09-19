'use strict';

const https = require('https');

/*
 * Simplify interacting with HTTP/HTTPS without having to
 *  add on another library like request.
 */
module.exports = {
  getResponse : (options,toPost) => new Promise( (resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('error', () => reject('Error communicating with options, ' + JSON.stringify(options)) );
      res.on('end', () => {
        resolve(body);
      });
    });
    req.on('error', (error) => reject(error));
    if(toPost){
      req.write(JSON.stringify(toPost));
    }
    req.end();
  })
};