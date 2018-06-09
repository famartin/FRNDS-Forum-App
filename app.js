var express = require('express');
var login = require('./login/index');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use('/login', login);

app.get('/', function(req, res){
	res.render('home');
});

app.listen(3000);
