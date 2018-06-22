const express = require('express');
const router = express.Router();
const db = require('../db.js');
const expressValidator = require('express-validator');
const passport = require('passport');

/** Check Message Form Fields **/

var checkMessageFields = function(req){
	req.checkBody('toUsername', 'You need to type a username').notEmpty();
	req.checkBody('messageText', 'Message can not be blank').notEmpty();
	req.checkBody('messageText', 'Message can not exceed 600 characters').len(1, 600);
}

/** Chat GET Route **/

router.get('/chat', authenticationMiddleware(), function(req, res){
	res.render('chat');
});

/** Message GET Route **/

router.get('/message', authenticationMiddleware(), function(req, res){
	res.render('message');
});

/** Message POST Route **/

router.post('/message', authenticationMiddleware(), function(req, res){
	checkMessageFields(req);

	var errors = req.validationErrors();

	if(errors){
		res.render('message', {errors: errors});
	}else{
		db.User.findOne({username: req.body.toUsername}, function(err, user){
			if (err) throw err;
			if (user != null){
				var message = new db.Message({
					toUsername: user.username,
					fromUsername: req.session.passport.user.username,
					messageText: req.body.messageText
				});

				message.save(function(err){
					if(err) throw err;
					res.redirect('back');
				});
			}else{
				res.render('message', {notFound: 'User does not exist'});
			}
		});
	}
});

/** Show Message GET Route **/
router.get('/show-message/:id', authenticationMiddleware(), function(req, res){
	db.Message.findById(req.params.id, function(err, message){
		if (message != null){
			if (req.session.passport.user.username == message.toUsername){
				res.render('show-message', {message: message});
			}else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
	});
});

/** Remove Message GET Route **/

router.get('/remove/message/:id', authenticationMiddleware(), function(req, res){
	db.Message.findById(req.params.id, function(err, message){
		if (message != null){
			if (req.session.passport.user.username == message.toUsername){
				db.Message.findByIdAndDelete(req.params.id, function(err, message){
					res.redirect(`/profile/${message.toUsername}`);
				});
			}else{
				res.redirect('/');
			}
		}else{
			res.redirect('/');
		}
	});
});

/** Check to see if a user is signed in **/

function authenticationMiddleware() {
        return (req, res, next) => {
                if (req.isAuthenticated())
                	return next();
        	res.redirect('/login')
	}
}

module.exports = router;
