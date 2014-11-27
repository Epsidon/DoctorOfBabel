var express = require('express');
var fs = require('fs');
var archiver = require('archiver');
var uuid = require('node-uuid');
var router = express.Router();
var Expression = require('../models/expression');
var Language = require('../models/language');
var User = require('../models/user');
var Version = require('../models/version');


/* Expressions */
router.route('/expressions')

	// create an expression
	.post(function(req, res) {
		
		var expression = new Expression();		
		expression.english = req.body.english;
		expression.translation = req.body.translation;
		expression.audio = req.body.audio;
		expression.language = req.body.language;

		expression.save(function(err, product, numberAffected) {
			if (err)
				res.send(err);

			res.json({ numberAffected: numberAffected });
		});

		
	})

	// get all the expressions
	.get(function(req, res) {
		Expression.find({removed: false}, function(err, expressions) {
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

router.route('/expressions/remove')

	// Edit an expression
	.post(function(req, res) {

		Expression.findOneAndRemove({ _id: req.body.id }, 
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



router.get('/version', function(req, res) {
	Version.find({name: 'global'}, function(err, version) {
		if (err)
			console.log(err);
		res.json(version);
	});
});


// This will reply back to the client sending a status code
// 100: updates found, get ready to download
// 200: no update required
// 300: error encountered somewhere, try again
router.get('/version/:client_version', function(req, res) {
	var clientVersion = req.params.client_version;
	Version.findOne({name: 'global'}, function(err, version) {
		if (err) {
			res.json({ status: 300,
							   message: 'Error encountered. Please try again.' });
		} else if (version.global_version - clientVersion <= 0) {
				res.json({ status: 200,
								 message: 'No new updates.' });
		} else {
			getUpdates(req, clientVersion, function(err, download) {
				if (err) {
					res.json({ status: 300,
									   message: 'Error encountered. Please try again.' });
				} else {
					res.json({ status: 100,
										version: version.global_version,
										link: download });
				}
			});
		}
	});
});

	// Download the temp ZIP files
router.get('/download/:file_id', function(req, res, next) {
	var zipArchive = fs.createReadStream('./uploads/' + req.params.file_id + '.zip');
	zipArchive.on('error', function(err) {
		console.log(err);
		next(err);
	});

	zipArchive.on('close', function() {
		res.writeHead(200, {
			'Content-Type': 'application/zip',
		});
	});
		
	zipArchive.pipe(res);
});

router.post('/version/delete', function(req, res) {
	var uuid = req.body.name;
	fs.unlink('./uploads/' + uuid + '.zip');
	res.json({ message: 'Deleted' });
});

router.post('/version', function(req, res) {
	var version = new Version();
	version.save(function(err) {
		if (err)
			console.log(err);
		res.json({ message: 'Created' });
	});
});

module.exports = router;





// Helper to construct the updates. Consider moving it somewhere else after
function getUpdates(req, clientVersion, done) {
	var result = {};
	// Get the languages first
	Language.find({ version: { $gt: clientVersion } }, 
		'_id name info map removed', function(err, languages) {
  	if (err) {
  		done(err, null);
  	} else {
  		result.languages = languages;
  		Expression.find({ version: { $gt: clientVersion } }, 
  			'_id english translation audio languages removed', function(err, expressions) {
		  	if (err) {
		  		done(err, null);
		  	} else {
		  		result.expressions = expressions;
		  		var name = uuid.v4();
		  		var output = fs.createWriteStream('./uploads/' + name + '.zip');
		  		var archive = archiver('zip');
		  		archive.pipe(output);

		  		var langStream;
		  		languages.forEach(function(element) {
		  			var path = './uploads/' + element.map.split('/')[3];
		  			langStream = fs.createReadStream(path);
		  			langStream.on('error', function(err) {
		  				console.log(err);
		  				done(err, null);
		  			});
		  			archive.append(langStream, {name: element.map.split('/')[3]});
		  		});

		  		var exprStream;
		  		expressions.forEach(function(element) {
		  			var path = './uploads/' + element.audio.split('/')[3];
		  			exprStream = fs.createReadStream(path);
		  			exprStream.on('error', function(err) {
		  				console.log(err);
		  				done(err, null);
		  			});
		  			archive.append(exprStream, {name: element.audio.split('/')[3]});
		  		});

		  		archive.append(JSON.stringify(result), { name: name+'.json' }).finalize();
		  		output.on('close', function() {
		  			var link = req.protocol + '://' + req.get('host') + '/api/download/' + name;
		  			done(null, link);
		  		});
		  	}
		 });		
  	}
	});
}
