var express = require('express');
var router = express.Router();
var Language = require('../models/language');
var Expression = require('../models/expression');
var User = require('../models/user')

module.exports = function(passport) {

	// Ensure user is authenticated before processing
	// request to /dashboard
	router.use(function(req, res, next) {
		if (!req.isAuthenticated()) {
			req.flash('errorLogin', 'Please login to access dashboard');
			res.redirect('/login');
		} else {
			next();
		}
	});

	router.get('/', function(req, res) {
		Language.find({}, function(err, langs) {

			var initValue = 1;

			if (err)
				console.log(err);

			langs = sortByKey(langs, 'name');

			langs.forEach(function(language) {
				console.log(language);
			});

			//Callback junction 
			Expression.find({ language: langs[initValue]._id }, function(err, exprs){
				if (err)
					console.log(err)
				if(!req.user)
					res.redirect('/login');
				else {
					if(req.user.role === 'admin')
						res.render('dashboard/dashboard-admin', {languages: langs, expressions: exprs });
					if(req.user.role === 'staff')
						res.render('dashboard/dashboard', { languages: langs, expressions: exprs });
				}
			});
			
		});
	});

	router.get('/languages', function(req, res) {
		Language.find(function(err, languages) {
			if (err)
				res.send(err);

			res.render('dashboard/languages', { languages: languages });
		});
	});

	router.get('/languages/:lang_id', function(req, res) {
	Expression.find({ language: req.params.lang_id }, function(err, expressions){
		if (err)
			console.log(err);
		res.render('dashboard/editlanguages', { expressions: expressions, language: req.param('lang_id')} );
		});
	});

	router.get('/users', function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);

			res.render('dashboard/users', { users: users });
		});
	});

	router.get('/expressions', function(req, res) {
		Expression.find(function(err, expressions) {
			if (err)
				res.send(err);

			res.render('dashboard/expressions', { expressions: expressions });
		});
	});

	router.get('/sessions', function(req, res) {
		//TODO
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
