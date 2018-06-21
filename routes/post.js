const express = require('express');
const router = express.Router();
const db = require('../db.js');
const expressValidator = require('express-validator');
const passport = require('passport');

/** Check Post Form Fields **/

var checkPostFields = function(req){
	req.checkBody('postTitle', 'Title can not be empty').notEmpty();
	req.checkBody('postTitle', 'Title must not exceed 70 characters long').len(1, 70);
}

/** Check Comment Form Fields **/

var checkCommentFields = function(req){
	req.checkBody('comment', 'Comment can not be empty.').notEmpty();
}

/** Post GET Route **/

router.get('/post', authenticationMiddleware(), function(req, res){
	res.render('post');
});

/** Post POST Route **/

router.post('/post', authenticationMiddleware(), function(req, res){
	
	checkPostFields(req);

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

/** Show Post GET Route **/

router.get('/show-post/:id', function(req, res){
	
	db.Post.findById(req.params.id, function(err, post){
		if (err) throw err;
		if (post != null)
			db.Comment.find({postId: req.params.id}, function(err, comments){
				if (err) throw err;
				if (comments != null)
					res.render('show-post', {post: post, comments: comments});
				else
					res.render('show-post', {post: post});
					
			});
		else
			res.redirect('/');
	});
});

/** Remove Post GET Route **/

router.get('/remove/:id', authenticationMiddleware(), function(req, res){
	db.Post.findById(req.params.id, function(err, post){
		if(err) throw err;
		if(post != null) {
			if (req.session.passport.user.username == post.author){
				db.Post.findByIdAndRemove(post._id, function(err){
					if(err) throw err;
					res.redirect('/');
					
				});
			}else
				res.redirect('/');
		}else
			res.redirect('/');
	});
});

/** Comment POST Route **/

router.post('/comment/:postId', authenticationMiddleware(), function(req, res){
	checkCommentFields(req);
	
	var errors = req.validationErrors();
	if(errors){
		res.redirect('/');
	}else{
		var comment = new db.Comment({
			text: req.body.comment,
			author: req.session.passport.user.username,
			postId: req.params.postId
		});

		comment.save(function(err){
			if(err) throw err;
			res.redirect('back');
		});
	}
});

/** Remove Comment GET Route **/

router.get('/comment/remove/:id', authenticationMiddleware(), function(req, res){
	db.Comment.findById(req.params.id, function(err, comment){
		if(err) throw err;
		if(comment != null){
			if(req.session.passport.user.username == comment.author){
				db.Comment.findByIdAndRemove(comment._id, function(err){
					if(err) throw err;
					res.redirect('back');
				});
			}else
				res.redirect('back');
		}else
			res.redirect('back');
	});
});

/** Checks to see if a User is in a session **/

function authenticationMiddleware () {
	return (req, res, next) => {
		if (req.isAuthenticated())
			return next();
		res.redirect('/login')
        }
}

module.exports = router;
