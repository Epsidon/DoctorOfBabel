var mongoose = require('mongoose');
var shortid = require('shortid');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var roles = 'admin staff normal'.split(' ');

var UserSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate },
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	role: { type: String, enum: roles },
});

UserSchema.pre('save', function(next) {
	var user = this;

	// If password is not modified don't hash it
	if (!user.isModified('password'))
		return next();

	// Hash password using bcrypt with 10 rounds
	bcrypt.genSalt(10, function(err, salt) {
		if (err)
			return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err)
				return next(err);
			user.password = hash;
			next();
		});
	});
});

// Verify password
UserSchema.methods.checkPassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, match) {
		if (err)
			return callback(err);
		callback(null, match);
	});
};

module.exports = mongoose.model('User', UserSchema);