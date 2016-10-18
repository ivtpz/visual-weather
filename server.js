const express = require('express');
const engines = require('consolidate');
const fetch = require('./lib/fetchForecast.js')
const bodyParser = require('body-parser');

const app = express();

//Set the port
const port = process.env.PORT || 3030;

//Set view engine
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//define middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))

//handle routes
app.get('/', (req, res) => res.render('index.html'));

app.get('/forecast', fetch.request);

app.get('/history', fetch.histRequest);

app.listen(port);
