var express = require('express');
var router = express.Router();
var Expression = require('../models/expression');
var Language = require('../models/language');

/* Test API GET */
router.get('/', function(req, res) {
	res.json({ message: 'API Works!' });
});


/* Expressions */
router.route('/expressions')

	// create an expression
	.post(function(req, res) {
		
		var expression = new Expression();		
		expression.sentence = req.body.sentence;

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


/* Languages */
router.route('/languages')

	// create a language
	.post(function(req, res) {
		
		var language = new Language();		
		language.name = req.body.name;
		language.translations.push({
			translation: req.body.translation,
			meaning: req.body.meaning,
			audio: req.body.audio
        });

		language.save(function(err) {
			if (err)
				res.send(err);

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

router.route('/languages/:lang_id')

	// get specific language 
	.get(function(req, res) {
		Language.findById(req.params.lang_id)
		.populate('translations.translation')
		.exec(function (err, language) {
			if (err)
				res.json({ status: 'Error occured retrieving the language'});
			res.json(language);
		});
	});

module.exports = router;