const express = require('express');
var engines = require('consolidate');
var fetch = require('./lib/fetchForecast.js')

const app = express();
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => res.render('index.html'))

app.get('/forecast', fetch.request)

app.listen(3030);
