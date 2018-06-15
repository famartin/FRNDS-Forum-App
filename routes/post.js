const express = require('express');
const router = express.Router();
const db = require('../db.js');
const expressValidator = require('express-validator');
const passport = require('passport');

var checkFormFields = function(req){
	req.checkBody('postTitle', 'Title can not be empty.').notEmpty();
	req.checkBody('postTitle', 'Title must be between 1-70 characters long.').len(1, 70);
}

router.get('/post', authenticationMiddleware(), function(req, res){
	res.render('post');
});

router.post('/post', authenticationMiddleware(), function(req, res){
	checkFormFields(req);
	console.log(req.body);

	var errors = req.validationErrors();
	if(errors){
		res.render('post', {errors: errors});
	}
	else{
		var post = new db.Post({
			title: req.body.postTitle,
			text: req.body.postText,
			author: req.session.passport.user.username
		});

		post.save(function(err){
			if(err) throw err;
			res.redirect('/');
		});
	}
});

router.get('/show-post/:id', function(req, res){
	db.Post.findById(req.params.id, function(err, post){
		if (err) throw err;
		if (post != null)
			res.render('show-post', {post: post});
		else
			res.redirect('/');
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
