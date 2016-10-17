const express = require('express');
var engines = require('consolidate');

const app = express();
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => res.render('index.html'))
app.listen(3030);
