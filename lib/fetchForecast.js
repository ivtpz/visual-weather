"use strict";
const DarkSky = require('dark-sky');
const GeoCode = require('./unZip.js');
const config = require('../config/darkSky.js')

exports.request = function (req, res) {
  let zip = req.query.zip;
  res.writeHead(200);
  GeoCode.request(zip)
  .then(weather)
  .then(data => {
    res.end(JSON.stringify(data));
  })
};

exports.histRequest = function (req, res) {
  let zip = req.query.zip;
  let time = req.query.time;
  res.writeHead(200)
  GeoCode.request(zip)
  .then(latLong => {
    return pastWeather(latLong, time)
  })
  .then(data => {
    res.end(JSON.stringify(data));
  })
};

function weather (latLong) {
  const forecast = new DarkSky(config.APIKey);
  let lat = latLong.lat;
  let long = latLong.lng;
  return forecast
          .latitude(lat)
          .longitude(long)
          .exclude('minutely,daily')
          .extendHourly(true)
          .get();
}

function pastWeather (latLong, time) {
  const forecast = new DarkSky(config.APIKey);
  let lat = latLong.lat;
  let long = latLong.lng;
  return forecast
          .latitude(lat)
          .longitude(long)
          .time(time)
          .exclude('minutely,daily,currently,alerts,flags')
          .get();
}

