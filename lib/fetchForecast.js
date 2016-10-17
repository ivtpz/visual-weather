const config = require('../config/darkSky.js');
const DarkSky = require('dark-sky');
const GeoCode = require('./unZip.js')
const forecast = new DarkSky(config.APIKey);

exports.request = function (req, res) {
  console.log(req.query)
  let zip = req.query.zip;
  console.log(zip)
  res.writeHead(200);
  GeoCode.request(zip)
  .then(weather)
  .then(data => {
    res.end(JSON.stringify(data));
  })
};

function weather (latLong) {
  let lat = latLong.lat;
  let long = latLong.lng;
  return forecast
          .latitude(lat)
          .longitude(long)
          .exclude('minutely,daily')
          .extendHourly(true)
          .get();
}

