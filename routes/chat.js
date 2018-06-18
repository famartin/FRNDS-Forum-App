const express = require('express');
const router = express.Router();
const db = require('../db.js');
const expressValidator = require('express-validator');
const passport = require('passport');

router.get('/chat', authenticationMiddleware(), function(req, res){
	res.render('chat');
});

function authenticationMiddleware () {
        return (req, res, next) => {
                if (req.isAuthenticated())
                	return next();
        	res.redirect('/login')
	}
}

module.exports = router;
