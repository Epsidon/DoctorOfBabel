var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {

	passport.use('login', new LocalStrategy({
			passReqToCallback: true
		},
		function(req, username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err)
					return done(err);
				if (!user)
					return done(null, false, req.flash('errorLogin', 'Username not found'));
				if (!user.checkPassword(password))
					return done(null, false, req.flash('errorLogin', 'Incorrect password'));
				return done(null, user);
			});
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback: true
		},
		function(req, username, password, done) {
			User.findOne({ username: username}, function(err, user) {
				if (err)
					return done(err);
				if(user)
					return done(null, false, req.flash('errorSignup', 'User already exists'));
				// User doesn't exist
				var newUser = new User();
				user.username = req.params.username;
				user.password = req.params.password;
				user.role = 'normal';

				newUser.save(function(err) {
					if (err)
						console.log(err);
					return(null, newUser);
				});
			});
		}
	));
	
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};