var 	mongoose = require('mongoose');
var 	key = require('./keys.js');
mongoose.connect("mongodb://" + key.username + ":" + key.password + "@ds153700.mlab.com:53700/chat-app");

var 	Schema = mongoose.Schema;

var 	db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('were connected!');
});

var	userSchema = new Schema({
	email:		{type: String, unique: true, required: true},
	username:	{type: String, unique: true, required: true},
	password:	{type: String, unique: true, required: true}
});

var 	User = mongoose.model('User', userSchema);

module.exports = {
	db,
	User
};
