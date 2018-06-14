var 	mongoose = require('mongoose');
var 	key = require('./keys.js');
var	uniqueValidator = require('mongoose-unique-validator');

mongoose.connect("mongodb://" + key.username + ":" + key.password + "@ds153700.mlab.com:53700/chat-app");

var 	Schema = mongoose.Schema;

var 	db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('Database is connected!');
});

var	userSchema = new Schema({
	firstName:	{type: String, required: true},
	lastName:	{type: String, required: true},
	email:		{type: String, unique: true, required: true},
	username:	{type: String, unique: true, required: true},
	password:	{type: String, required: true}
});

var	postSchema = new Schema({
	title:		{type: String, required: true},
	text:		{type: String},
	author:		{type: String, required: true},
	date:		{type: Date, default: Date.now}
	
});

userSchema.plugin(uniqueValidator, { message: 'This {PATH} is already taken, please choose another.' });

var 	User = mongoose.model('User', userSchema);
var	Post = mongoose.model('Post', postSchema);

module.exports = {
	db,
	User,
	Post
};
