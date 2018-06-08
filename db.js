const mongoose = require('mongoose');
mongoose.connect('mongodb://famartin:password1@ds153700.mlab.com:53700/chat-app');

module.exports = mongoose;
