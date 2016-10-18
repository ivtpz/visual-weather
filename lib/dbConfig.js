var mongoose = require('mongoose');

//Connect to DB
mongoose.connect('mongodb://localhost:27017/visualWeather');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('MongoDB connected');
});

var dataSchema = mongoose.Schema({
  name: {type: String, required: true, index: { unique: true }},
  weatherData: {type: Array}
})

var SavedVisual = mongoose.model('SavedVisual', dataSchema);

module.exports = SavedVisual;