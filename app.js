var express = require('express');
var routes = require('./routes/index');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db.js');
var MongoStore = require('connect-mongo')(session);
var randomString = require('randomstring');
var app = express();
var bcrypt = require('bcryptjs');
var port = 3000;

app.set('view engine', 'ejs');
app.set('trust proxy', 1) // trust first proxy

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

var sessionStore = new MongoStore({ mongooseConnection: db.db });

app.use(session({
	secret: 'dygjayvwaydjyayfgesj',
	resave: false,
	store: sessionStore,
	saveUninitialized: false,
	//cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

passport.use(new LocalStrategy(
  function(username, password, done) {
	db.User.findOne({ username: username }, function(err, user) {
  		if (err)
			return done(err);
		if (user == null)
			return done(null, false);
		bcrypt.compare(password, user.password, function(err, response){
			if (response == true)
			{
				return done(null, user);
			}
			else
				return done(null, false);
		});
	});
  }
));

app.get('/', function(req, res){
	console.log('user: ' + JSON.stringify(req.user, ['username']));
	console.log('authenticated: ' + req.isAuthenticated());
	res.render('home');
});

app.listen(port);
console.log(`Listening on port ${port}`);
