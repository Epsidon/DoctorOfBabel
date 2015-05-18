var express = require('express');
var fs = require('fs');
var archiver = require('archiver');
var uuid = require('node-uuid');
var router = express.Router();
var Expression = require('../models/expression');
var Language = require('../models/language');
var Version = require('../models/version');
var async = require('async');


/* Expressions */
router.route('/expressions')

	// get all the expressions
	.get(function(req, res) {
		Expression.find({removed: false}, function(err, expressions) {
			if (err)
				res.send(err);

			res.json(expressions);
		});
	});

/* Languages */
router.route('/languages')

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
		Expression.find({ language: req.param('lang_id'), removed: false }, function(err, expressions){
			if (err)
				console.log(err);
			res.json(expressions);
		});
	});

router.get('/version', function(req, res) {
	Version.find({name: 'global'}, function(err, version) {
		if (err)
			console.log(err);
		res.json(version);
	});
});

router.post('/version', function(req, res) {
	var version = new Version();
	version.save(function(err) {
		if (err)
			console.log(err);
		res.json({ message: 'Created' });
	});
});


router.post('/version/delete', function(req, res) {
	var uuid = req.body.name;
	fs.unlink('./uploads/' + uuid + '.zip', function(err) {
		if (err) {
			console.log(err);
		}
	});
	res.json({ message: 'Deleted' });
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
			getUpdates(req, res, clientVersion, version.global_version, function(err, download) {
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
		
	zipArchive.pipe(res);

	
});


module.exports = router;





// Helper to construct the updates. Consider moving it somewhere else after
function getUpdates(req, res, clientVersion, serverVersion, done) {
	var result = {};
	result.version = serverVersion;
	// Get the languages first
	Language.find({ version: { $gt: clientVersion } }, 
		'_id name info map removed', function(err, languages) {
  	if (err) {
  		done(err, null);
  	} else {
  		result.languages = languages;
  		Expression.find({ version: { $gt: clientVersion } }, 
  			'_id english translation audio language removed', function(err, expressions) {
		  	if (err) {
		  		done(err, null);
		  	} else {
		  		result.expressions = expressions;
		  		var name = uuid.v4();
		  		result.zipName = name;
		  		var output = fs.createWriteStream('./uploads/' + name + '.zip');
		  		var archive = archiver('zip');
		  		archive.pipe(output);

  				async.eachSeries(languages, function(element, callback1) {
  					console.log('LANGUAGES');
  					if (element.removed === false) {
  						var path = './uploads/' + element.map;
			  			var langStream = fs.createReadStream(path);
			  			langStream.on('error', function(err) {
			  				console.log(err);
			  				callback1(err, null);
			  			});
			  			archive.append(langStream, {name: element.map});	
  					}
  					
		  			callback1();
  				}, function(err) {
  					if (err) {
  						done(err, null);
  					} else {
  						async.eachSeries(expressions, function(element, callback2) {
  							console.log('EXPRESSIONS');
  							if (element.removed === false) {
  								var path = './uploads/' + element.audio;
					  			var exprStream = fs.createReadStream(path);
					  			exprStream.on('error', function(err) {
					  				console.log(err);
					  				callback2(err, null);
					  			});
					  			archive.append(exprStream, {name: element.audio});
  							}  							
				  			callback2();
  						}, function(err) {
  							if (err) {
  								done(err, null);
  							} else {
  								archive.append(JSON.stringify(result), { name: 'scheme.json' }).finalize();
						  		output.on('close', function() {
						  			var link = req.protocol + '://' + req.hostname + ':' + res.locals.port + '/api/download/' + name;
						  			done(null, link);
						  		});
  							}
  						});
  					}
  				});

		  	}
		 });		
  	}
	});
}
