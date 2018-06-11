var express = require('express');
var login = require('./login/index');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var randomString = require('randomstring');
var app = express();
var port = 3000;

app.set('view engine', 'ejs');
app.set('trust proxy', 1) // trust first proxy

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(session({
  secret: randomString.generate(),
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', login);

app.get('/', function(req, res){
	console.log('user: ' + req.user);
	console.log('authenticated: ' + req.isAuthenticated());
	res.render('home');
});

app.listen(port);
console.log(`Listening on port ${port}`);
