var express = require('express');
var router = express.Router();
var Language = require('../models/language');
var Expression = require('../models/expression');

module.exports = function(passport) {
	router.get('/', function(req, res) {
		Language.find({}, function(err, langs) {

			var initValue = 0;
			var initLang = [];
			var initInfo;
			var initMap;

			if (err)
				console.log(err);

			langs = sortByKey(langs, 'name');

			initLang = langs[initValue];
			initInfo = initLang.info;
			initMap = initLang.map;
			initLangName = initLang.name;
			console.log("INIT LANG NAME:" + initLangName);

			//Callback junction 
			Expression.find({ language: langs[initValue]._id }, function(err, exprs) {
				if (err)
					console.log(err)
				res.render('home', { languages: langs,
				 expressions: exprs,
				  initInfo: initInfo,
				  initMap: initMap,
				  initLangName: initLangName });
			});
		});
	});

	router.get('/login', function(req, res) {
		res.render('login', { user: req.user });
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
	}));

	return router;
};


//Sorts langauges alphabetically 
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }); 
}
