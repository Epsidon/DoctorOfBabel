var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err)
					return done(err);
				if (!user)
					return done(null, false, { message: 'Username wrong'});
				if (!user.checkPassword(password))
					return done(null, false, { message: 'Incorrect password'});
				return done(null, user);
			});
		}
	));
};