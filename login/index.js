const express = require('express');
const router = express.Router();
const db = require('../db.js');
var expressValidator = require('express-validator');

router.get('/', function(req, res){
	res.render('login');
});

router.get('/signup', function(req, res){
	res.render('signup');
});

router.post('/signup', function(req, res, next){
	req.checkBody('username', 'Username field can not be empty').notEmpty();
	req.checkBody('email', 'Email field can not be empty').notEmpty();
	req.checkBody('password', 'Password field can not be empty').notEmpty();
	console.log(req.body);

	const errors = req.validationErrors();
	if (errors){
		console.log(`errors: ${JSON.stringify(errors)}`);
		res.redirect('/login/signup');
	}
	else{
		var user = new db.User({
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});

		user.save(function(err){
			if (err) throw (err);
		});

		res.redirect('/');
	}
});

module.exports = router;
