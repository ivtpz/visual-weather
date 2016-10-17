const config = require('../config/darkSky.js');
const DarkSky = require('dark-sky');
const forecast = new DarkSky(config.APIKey);

exports.request = function (req, res) {
  console.log(req.query)
  let lat = req.query.lat;
  let long = req.query.long;
  console.log(lat, long)
  res.writeHead(200);
  // forecast.latitude(lat).longitude(long).get()
  // .then(data => {
  //   res.end(JSON.stringify(data));
  // })
  res.end()
};

