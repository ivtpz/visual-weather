const config = require('../config/darkSky.js');
const DarkSky = require('dark-sky');
const forecast = new DarkSky(config.APIKey);

exports.request = function (req, res) {
  res.writeHead(200);
  forecast.latitude(34).longitude(-85).get()
  .then(data => {
    console.log(data)
    res.end(JSON.stringify(data));
  })
};

