var express = require('express');
var users = require('./routes/users');
var post = require('./routes/post');
var chat = require('./routes/chat');
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
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bcrypt = require('bcryptjs');
var port = 3000;

app.set('view engine', 'ejs');
app.set('trust proxy', 1);

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

/** Passport Initialization **/

app.use(passport.initialize());
app.use(passport.session());

/** Global variables to use in views **/

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

app.use('/', users, post, chat);

/** Passport Local Strategy **/

passport.use(new LocalStrategy(function(username, password, done) {
	db.User.findOne({ username: username }, function(err, user) {
  		if (err)
			return done(err);
		if (user == null)
			return done(null, false);
		bcrypt.compare(password, user.password, function(err, response) {
			if (response == true)
				return done(null, user);
			else
				return done(null, false);
		});
	});
}));

/** Home Route **/

app.get('/', function(req, res){
	//console.log('user: ' + JSON.stringify(req.user, ['username']));
	//console.log('authenticated: ' + req.isAuthenticated());
	db.Post.find(function(err, posts){
		if (err) throw err;
		//console.log(posts);
		if (posts != null)
			res.render('home', {posts: posts});
		else
			res.render('home');
	});
});

/** Socket.io Chat **/

var usernames = {};

io.on('connection', function(socket){
	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit('chat message', 'you have connected');
		socket.broadcast.emit('chat message', username + ' entered chat');
		io.sockets.emit('updateusers', usernames);
	});

	socket.on('chat message', function(data){
		console.log('message: ' + data);
		socket.broadcast.emit('chat message', data);
	});
	
	socket.on('typing', function(data){
		socket.broadcast.emit('typing', data);
	});
	
	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('chat message', socket.username + ' left chat');
	});
});

/** Listen to the specified port **/

http.listen(port, function(){
	console.log(`Listening on port ${port}`);
});
