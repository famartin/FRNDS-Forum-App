const express = require('express');
const router = express.Router();
const db = require('../db.js');
const expressValidator = require('express-validator');
const passport = require('passport');

router.get('/post', authenticationMiddleware(), function(req, res){
	res.render('post');
});

router.post('/post', authenticationMiddleware(), function(req, res){
	
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
