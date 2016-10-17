var config = require('../config/darkSky.js');

exports.request = function (req, res) {
  console.log(config.APIKey)
  res.writeHead(200);
  res.end();
};

