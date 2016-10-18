"use strict";
const SavedVisual = require('./dbConfig.js');

exports.insert = function(req, res) {
  let name = req.body.name;
  SavedVisual.findOne({name: name})
  .then(savedData => {
    if (!savedData) {
      new SavedVisual({
        name: name,
        weatherData: req.body.weatherData
      }).save(function(err, newData) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(201).send(newData)
        }
      })
    } else {
      res.status(400).send("name exists already")
    }
  })
};

exports.extract = function(req, res) {
  console.log('fetching archives')
  SavedVisual.find()
  .exec((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(data)
    }
  })
}