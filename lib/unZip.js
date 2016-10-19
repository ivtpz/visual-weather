"use strict";
const GeoCoder = require('@google/maps').createClient({
  key: geoCode.APIKey
});
const Promise = require('bluebird')

exports.request = function (zip) {
  return new Promise((resolve, reject) => {
    GeoCoder.geocode({
      address: zip
    }, function(err, response) {
      if (!err) {
        resolve(response.json.results[0].geometry.location);
      } else {
        console.log(err)
        reject(err)
      }
    })
  })
};