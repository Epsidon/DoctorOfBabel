var express = require('express');
var router = express.Router();
var Language = require('../models/language');
var Expression = require('../models/expression');

/* GET home page. */
router.get('/', function(req, res) {
	Expression.find({}, function(err, exprs) {
		if (err)
			console.log(err)
		res.render('home', { expressions: exprs});
	});
});

module.exports = router;
