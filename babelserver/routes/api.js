var express = require('express');
var router = express.Router();
var Expression = require('../models/expression');
var Language = require('../models/language');
var User = require('../models/user');

// Test API GET
// This will be removed after API work is done
router.get('/', function(req, res) {
	res.json({ message: 'API Works!' });
});


/* Expressions */
router.route('/expressions')

	// create an expression
	.post(function(req, res) {
		
		var expression = new Expression();		
		expression.english = req.body.english;
		expression.translation = req.body.translation;
		expression.audio = req.body.audio;
		expression.language = req.body.language;

		expression.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Expression created!' });
		});

		
	})

	// get all the expressions
	.get(function(req, res) {
		Expression.find(function(err, expressions) {
			if (err)
				res.send(err);

			res.json(expressions);
		});
	});

router.route('/expressions/edit')

	// Edit an expression
	.post(function(req, res) {

			Expression.update({ _id: req.body.id }, 
				{$set: {english: req.body.english, translation: req.body.translation}}, 
				function (err, numberAffected, raw) {
  				if (err) console.log("Error: " + err);
				res.json({ numberAffected: numberAffected });
			});
	});

/* Languages */
router.route('/languages')

	// create a language
	.post(function(req, res) {
		var language = new Language();		
		language.name = req.body.name;
		language.info = req.body.info;
		language.map = req.body.map;

		language.save(function(err) {
			if (err)
				res.json(err);

			res.json({ message: 'Language created!' });
		});
	})

	// get all the languages 
	.get(function(req, res) {
		Language.find(function(err, languages) {
			if (err)
				res.send(err);

			res.json(languages);
		});
	});

// Get a specific language 
router.route('/languages/:lang_id')

	// get specific language 
	.get(function(req, res) {
		Expression.find({ language: req.param('lang_id') }, function(err, expressions){
			if (err)
				console.log(err);
			res.json(expressions);
		});
	});


// Users
router.route('/users')
	// Create user
	.post(function(req, res) {
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.role = req.body.role;

		user.save(function(err) {
			if (err)
				console.log(err);
			res.json({ message: 'User created' });
		});
	})
	// GET all users
	.get(function(req, res) {
		User.find({}, function(err, users) {
			if (err)
				console.log(err);
			res.json(users);
		});
	});

module.exports = router;