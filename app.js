const express = require('express');
const login = require('./login/index');
const app = express();

app.listen(3000);
app.set('view engine', 'ejs');
app.use('/login', login);

app.get('/', function(req, res){
	res.render('home');
});

