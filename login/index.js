const express = require('express');
const router = express.Router();
const db = require('../db.js');
const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

var checkFormFields = function(req){
	var u = 'username';
	var e = 'email';
	var p = 'password';
	var p2 = 'password2';
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

router.get('/', function(req, res){
	res.render('login');
});

router.get('/signup', function(req, res){
	res.render('signup');
});

router.post('/signup', function(req, res, next){
	checkFormFields(req);
	console.log(req.body);

	var errors = req.validationErrors();
	if (errors){
		console.log(`errors: ${JSON.stringify(errors)}`);
		res.render('signup', {errors: errors});
	}
	else{
		var hash = bcrypt.hashSync(req.body.password, salt);
		var user = new db.User({
			email: req.body.email,
			username: req.body.username,
			password: hash
		});

		user.save(function(err){
			if (err) throw (err);
		});

		res.redirect('/');
	}
});

module.exports = router;
