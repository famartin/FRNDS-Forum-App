var 	mongoose = require('mongoose');
var 	key = require('./keys.js');
var		uniqueValidator = require('mongoose-unique-validator');

/** Connect to Mongodb **/

mongoose.connect("mongodb://" + key.username + ":" + key.password + "@ds249818.mlab.com:49818/nodejschat-app");

var 	Schema = mongoose.Schema;

var 	db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/** Connection Message **/

db.once('open', function(){
	console.log('Database is connected!');
});

/** User Schema **/

var	userSchema = 	new Schema({
	firstName:		{type: String, required: true},
	lastName:		{type: String, required: true},
	email:			{type: String, unique: true, required: true},
	username:		{type: String, unique: true, required: true},
	password:		{type: String, required: true},
	img:			{data: Buffer, contentType: String}
});

/** Post Schema **/

var	postSchema = 	new Schema({
	title:			{type: String, required: true},
	text:			{type: String},
	author:			{type: String, required: true},
	date:			{type: Date, default: Date.now}
	
});

/** Comment Schema **/

var	commentSchema =	new Schema({
	text:			{type: String, required: true},
	author:			{type: String, required: true},
	date:			{type: Date, default: Date.now},
	postId:			{type: String, required: true}
		
});

/** Message Schema **/

var	messageSchema = new Schema({
	toUsername:		{type: String, required: true},
	fromUsername:	{type: String, required: true},
	messageText:	{type: String, required: true},
	date:			{type: Date, default: Date.now}
});

/** Unique check for the Sign Up Form fields **/

userSchema.plugin(uniqueValidator, { message: 'This {PATH} is already taken, please choose another.' });

var User = 		mongoose.model('User', userSchema);
var	Post =		mongoose.model('Post', postSchema);
var	Comment =	mongoose.model('Comment', commentSchema);
var	Message =	mongoose.model('Message', messageSchema);

/** Exports **/

module.exports = {
	db,
	User,
	Post,
	Comment,
	Message
};
