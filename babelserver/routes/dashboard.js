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
		if(req.user.role === 'admin')
			res.render('dashboard/dashboard-admin');
		if(req.user.role === 'staff')
			res.render('dashboard/dashboard');			
	});

	// List the languages to edit them
	router.get('/languages', function(req, res) {
		Language.find(function(err, languages) {
			if (err)
				res.send(err);

			res.render('dashboard/languages', { languages: languages });
		});
	});

	/*router.get('/languages/new', function(req, res) {
		res.render('dashboard/newlanguages');
	});

	router.post('/languages/new', function(req, res) {
		//var language = new Language();
		//language.name = req.body.name.charAt(0).toUpperCase + req.body.name.slice(1);
		//language.info = req.body.info;
		console.dir(req.files.map.originalname);
		res.json({message: 'it worked'});

	});*/

	// Page to modify a language
	router.get('/languages/:lang_id', function(req, res) {
		Expression.find({ language: req.params.lang_id }, function(err, expressions){
			if (err)
				console.log(err);
			res.render('dashboard/editlanguages', { expressions: expressions, language: req.param('lang_id')} );
		});
	});




	router.post('/languages/:lang_id', function(req, res) {
		// TODO
		// This is where we verify the language info
		Language.find({ _id: req.params.lang_id })
		res.json({data: 'it worked'});
	});

	router.post('/languages/:lang_id/ready', function(req, res) {
		// TODO
		// This is where the language will change from draft to ready
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


