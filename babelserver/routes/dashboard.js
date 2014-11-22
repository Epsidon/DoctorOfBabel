var express = require('express');
var router = express.Router();
var Language = require('../models/language');
var Expression = require('../models/expression');
var User = require('../models/user')
var fs = require('fs');

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


	// Check for user permission level
	// Will be removed, we will just remove options for staff
	router.get('/', function(req, res) {
		if(req.user.role === 'admin')
			res.render('dashboard/dashboard-admin');
		if(req.user.role === 'staff')
			res.render('dashboard/dashboard');			
	});


	// List the languages as tabular data to edit them
	router.get('/languages', function(req, res) {
		Language.find(function(err, languages) {
			if (err) {
				console.log(err);
			} else {
				res.render('dashboard/languages', { languages: languages });
			}
		});
	});


	// Router to create new pages. The Flash messages are there
	// in case form error so we preserve the user input	
	router.get('/languages/new', function(req, res) {
		res.render('dashboard/newlanguages', {
			name: req.flash('nameError'),
			info: req.flash('infoError'),
			error: req.flash('error'),
		});
	});


	// Form submission for a new language. 
	router.post('/languages/new', function(req, res) {
		// If any field is missing, redirect user back to the form with 
		// error message
		if (!req.body.name || !req.body.info || !req.files.map) {
			req.flash('nameError', req.body.name);
			req.flash('infoError', req.body.info);
			req.flash('error', 'Error! There are empty fields.');
			res.redirect(req.originalUrl);
		} else {
			var language = new Language();
			language.name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
			language.info = req.body.info;
			var path = './uploads/' + req.files.map.name;
			fs.writeFile(path, req.files.map.buffer, function(err) {
				if (err) {
					req.flash('nameError', req.body.name);
					req.flash('infoError', req.body.info);
					req.flash('error', 'Error uploading the image. Try again.');
					res.redirect(req.originalUrl);
				} else {
					language.map = req.protocol + '://' + req.headers.host + '/' + req.files.map.name;
					language.save(function(err, lang) {
						if (err) {
							req.flash('nameError', req.body.name);
							req.flash('infoError', req.body.info);
							req.flash('error', 'Error occured creating language. Submit again.')
							res.redirect(req.originalUrl);
						} else {
							res.redirect(req.baseUrl + '/languages/' + lang._id + '/edit');
						}
					});
				}
			});
		}
	});


	// Page to modify a language
	router.get('/languages/:lang_id/edit', function(req, res) {
		console.log(req.params.lang_id);
		Language.findOne({ _id: req.params.lang_id}, function(err, language) {
			if (err) {
				console.log(err);
			} else {
				Expression.find({ language: req.params.lang_id}, function(err, expressions) {
					if (err) {
						console.log(err);
					} else {
						res.render('dashboard/editlanguages', { expressions: expressions, language: language} );
					}
				});
			}
		});
	});


	router.post('/languages/:lang_id/edit', function(req, res) {
		// Either publishing language or continuing as draft
		if (req.body.action === 'Save as Draft') {
			Language.findOne({ _id: req.params.lang_id }, function(err, language) {
				if (err) {
					console.log(err);
				} else {
					if (req.body.name)
						language.name = req.body.name;
					if (req.body.info)
						language.info = req.body.info;
					if (req.files.map) {
						var path = './uploads/' + req.files.map.name;
						fs.writeFile(path, req.files.map.buffer, function(err) {
							if (err) {
								console.log(err);
							} else {
								language.map = req.protocol + '://' + req.headers.host + '/' + req.files.map.name;
								language.save(function(err, lang) {
									if (err) {
										console.log(err);
									} else {
										res.redirect(req.baseUrl + '/languages/' + lang._id + '/edit');
									}
								});
							}
						});
					} else {
						language.save(function(err, lang) {
							if (err) {
								console.log(err);
							} else {
								res.redirect(req.baseUrl + '/languages/' + lang._id + '/edit');
							}
						});		
					}
				}
			});
		// Publishing a language	
		} else {
			Language.findOne({ _id: req.params.lang_id }, function(err, language) {
				
			});
		}
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


