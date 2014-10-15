var mongoose = require('mongoose');
var shortid = require('shortid');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate },
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	
});
