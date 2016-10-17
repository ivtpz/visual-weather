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
  .then((latLong) => {
    console.log(latLong)
    let lat = latLong.lat;
    let long = latLong.lng;
    forecast.latitude(lat).longitude(long).get()
    .then(data => {
      console.log(data)
      res.end(JSON.stringify(data));
    })
  })
};

