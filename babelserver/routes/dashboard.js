var express = require('express');
var router = express.Router();
var Language = require('../models/language');
var Expression = require('../models/expression');

module.exports = function(passport) {
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
				res.render('dashboard', { languages: langs, expressions: exprs });
			});
			
		});
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
