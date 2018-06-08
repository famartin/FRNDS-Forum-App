const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
	res.render('login');
});

router.all('/signup', function(req, res){
	res.render('signup');
});

module.exports = router;
