var express = require('express');
var router = express.Router();
var fs = require('fs');
var Language = require('../models/language');
var Expression = require('../models/expression');
var Resources = require('../resources/resources');

module.exports = function(passport) {

	router.get('/', function(req, res) {
		Language.find({removed: false, ready: true}, null, {sort: {name: 1}}, function(err, langs) {
			if (err)
				console.log(err);
			res.render('home', { languages: langs, 
				welcomeTitle: Resources.getWelcomeTitle, 
				welcomeBody: Resources.getWelcomeBody,
				welcomeInfo: Resources.getWelcomeInfo });
		});
	});

	router.get('/login', function(req, res) {
		res.render('login', { message: req.flash('errorLogin') });
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: (process.env.APP || '') + '/dashboard',
		failureRedirect: (process.env.APP || '') + '/login',
		failureFlash: true,
	}));

	router.get('/logout', function(req, res) {
		if (req.isAuthenticated()) {
			req.logout();
			res.redirect(res.locals.static + '/');	
		} else {
			res.redirect(res.locals.static + '/login');
		}	
	});

	return router;
};


//Sorts langauges alphabetically 
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }); 
}
