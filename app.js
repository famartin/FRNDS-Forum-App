var express = require('express');
var users = require('./routes/users');
var post = require('./routes/post');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var keys = require('./keys.js');
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
app.use(express.static(__dirname + '/public'));

var sessionStore = new MongoStore({ mongooseConnection: db.db });

app.use(session({
	secret: keys.sessionSecret,
	resave: false,
	store: sessionStore,
	saveUninitialized: false,
	//cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.isAuthenticated = req.
		isAuthenticated();
	if (req.isAuthenticated() == true){
		res.locals.username = req.session.
			passport.user.username;
		res.locals.firstName = req.session.
			passport.user.firstName;
	}
	else
		res.locals.username = "";
	next();
});

app.use('/', users, post);

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
	db.Post.find(function(err, posts){
		if (err) throw err;
		console.log(posts);
		if (posts != null)
			res.render('home', {posts: posts})
		else
			res.render('home');
	});
	//res.render('home');
});

app.listen(port);
console.log(`Listening on port ${port}`);
