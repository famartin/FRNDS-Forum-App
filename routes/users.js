const express = require('express');
const router = express.Router();
const db = require('../db.js');
const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const passport = require('passport');

var checkFormFields = function(req){
	var fN = 'firstName';
	var lN = 'lastName';
	var u = 'username';
	var e = 'email';
	var p = 'password';
	var p2 = 'password2';
	req.checkBody(`${fN}`, `${u} must be between 2-20 characters long.`).len(2, 20);
	req.checkBody(`${lN}`, `${u} must be between 2-25 characters long.`).len(2, 25);
	req.checkBody(`${u}`, `${u} field can not be empty.`).notEmpty();
	req.checkBody(`${u}`, `${u} must be between 5-15 characters long.`).len(5, 15);
	req.checkBody(`${e}`, `not a valid ${e}.`).isEmail();
	req.checkBody(`${e}`, `${e} should be between 4-100 characters long.`).len(4, 100);
	req.checkBody(`${p}`, `${p} must be between 8-100 characters long.`).len(8, 100);
	req.checkBody(`${p}`,
	`${p} must include one lowercase character, one uppercase character, a number, and a special character.`)
	.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	req.checkBody(`${p2}`, `${p} must be between 8-100 characters long.`).len(8, 100);
	req.checkBody(`${p2}`, `${p}s do not match`).equals(req.body.password);
}

router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login', passport.authenticate(
	'local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

router.get('/logout', function(req, res){
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

router.get('/signup', function(req, res){
	res.render('signup');
});

router.post('/signup', function(req, res, next){
	checkFormFields(req);
	console.log(req.body);

	var errors = req.validationErrors();
	if (errors){
		//console.log(`errors: ${JSON.stringify(errors)}`);
		res.render('signup', {errors: errors});
	}
	else{
		var hash = bcrypt.hashSync(req.body.password, salt);
		var user = new db.User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			username: req.body.username,
			password: hash
		});

		user.save(function(err){
			if (err){
				//console.log(err);
				res.render('signup', {uniqueErrors: err});
			}
			else{
				req.login(user, function(err) {
					if (err)
						console.log(err);
				});
				res.redirect('/');
			}
		});
	}
});

router.get('/profile/:username', function(req, res){
	db.User.findOne({ username: req.params.username }, function(err, user){
		if (err) throw err;
		console.log(user)
		if (user != null)
			db.Post.find({ author: req.params.username }, function(err, posts){
				if(err) throw err;
				res.render('profile', {user: user, posts: posts});
			});
		else
			res.render('404');
	});
});

router.get('/profile/:username/edit', authenticationMiddleware(), function(req, res){
	db.User.findOne({ username: req.params.username }, function(err, user){
		if (err) throw err;
		console.log(user)
		if (user != null && req.session.passport.user.username == req.params.username)
			res.render('update', {user: user});
		else
			res.render('404');
	});
});

router.post('/profile/:username/edit', authenticationMiddleware(), function(req, res){
	db.User.findOneAndUpdate({ username: req.params.username }, {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username
		}, function(err, user){
			if (err) throw err;
			console.log(user)
			if (user != null && req.session.passport.user.username == req.params.username)
				res.render('profile', {user: user});
			else
				res.render('404');
	});
});

router.get('/profile/:username/remove', authenticationMiddleware(), function(req, res){
	if (req.session.passport.user.username == req.params.username){
		db.User.findOneAndDelete({ username: req.params.username }, function(err, user){
			if (err) throw err;
			console.log(user)
			if (user != null && req.session.passport.user.username == req.params.username)
				res.redirect('/logout');
			else
				res.redirect('/');
		});
	}
	else
		res.redirect('/');
});

passport.serializeUser(function(id, done) {
  done(null, id);
});
 
passport.deserializeUser(function(id, done) {
  db.User.findById(id, function (err, user) {
    done(err, id);
  });
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		//console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport.user.username)}`);

		if (req.isAuthenticated())
			return next();
		res.redirect('/login')
	}
}

module.exports = router;
