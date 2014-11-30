var express = require('express');
var router = express.Router();
var Language = require('../models/language');
var Expression = require('../models/expression');
var DefaultExpression = require('../models/defaultexpression');
var User = require('../models/user')
var Version = require('../models/version');
var fs = require('fs');
var path = require('path');

module.exports = function(passport, s3) {

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
	router.get('/languages', function(req, res, next) {
		Language.find({ removed: false }, function(err, languages) {
			if (err) {
				console.log(err);
				next(err);
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
		} else if (req.files.map.extension !== 'jpg' && req.files.map.extension !== 'jpeg' &&
				req.files.map.extension !== 'png') {
			req.flash('nameError', req.body.name);
			req.flash('infoError', req.body.info);
			req.flash('error', 'Error! Image uploaded not jpg or png format.');
			res.redirect(req.originalUrl);
		} else {
			var language = new Language();
			language.name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
			language.info = req.body.info;
			var path = './uploads/' + req.files.map.name;
			fs.writeFile(path, req.files.map.buffer, function(err) {
				if (err) {
					console.log(err);
					req.flash('nameError', req.body.name);
					req.flash('infoError', req.body.info);
					req.flash('error', 'Error uploading the image. Try again.');
					res.redirect(req.originalUrl);
				} else {
					language.map = req.files.map.name;
					language.save(function(err, lang) {
						if (err) {
							console.log(err);
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
	router.get('/languages/:lang_id/edit', function(req, res, next) {
		Language.findOne({ _id: req.params.lang_id, removed: false }, function(err, language) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				Expression.find({ language: req.params.lang_id, removed: false }, function(err, expressions) {
					if (err) {
						console.log(err);
						next(err);
					} else {
						res.render('dashboard/editlanguages', { 
							expressions: expressions, 
							language: language,
							error: req.flash('error'),
						});
					}
				});
			}
		});
	});


	// Edit the individual language page
	router.post('/languages/:lang_id/edit', function(req, res, next) {
		// Either publishing language or continuing as draft
		if (req.body.action === 'Save as Draft') {
			Language.findOne({ _id: req.params.lang_id }, function(err, language) {
				if (err) {
					console.log(err);
					next(err);
				} else {
					if (req.body.name)
						language.name = req.body.name;
					if (req.body.info)
						language.info = req.body.info;
					if (req.files.map) {
						if (req.files.map.extension !== 'jpeg' && req.files.map.extension !== 'jpg' &&
							req.files.map.name !== 'png') {
							req.flash('error', 'Error! Image uploaded not jpg or png format.');
							res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
						} else {
							var path = './uploads/' + req.files.map.name;
							fs.writeFile(path, req.files.map.buffer, function(err) {
								if (err) {
									console.log(err);
									req.flash('error', 'Server error. Please try again.');
									res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
								} else {
									language.map = req.files.map.name;
									language.save(function(err, lang) {
										if (err) {
											console.log(err);
											req.flash('error', 'Server error. Please try again.');
											res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
										} else {
											res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
										}
									});
								}
							});	
						}
					} else { // No image uploaded
						language.save(function(err, lang) {
							if (err) {
								console.log(err);
								req.flash('error', 'Server error. Please try again.');
								res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
							} else {
								res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
							}
						});		
					}
				}
			});
		// Publishing or updating a language	
		} else {
			Language.findOne({ _id: req.params.lang_id }, function(err, language) {
				if (err) {
					console.log(err);
					next(err);
				} else {
					if (req.body.name)
						language.name = req.body.name;
					if (req.body.info)
						language.info = req.body.info;
					if (req.files.map) {
						if (req.files.map.extension !== 'jpeg' && req.files.map.extension !== 'jpg' &&
							req.files.map.name !== 'png') {
							req.flash('error', 'Error! Image uploaded not jpg or png format.');
							res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
						} else {
							var path = './uploads/' + req.files.map.name;
							fs.writeFile(path, req.files.map.buffer, function(err) {
								if (err) {
									console.log(err);
									req.flash('error', 'Server error. Please try again.');
									res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
								} else {
									language.map = req.files.map.name;
									language.ready = true;
									Version.findOneAndUpdate({ name: 'global'}, { $inc: {global_version: 1} }, function(err, version) {
										if (err) {
											console.log(err);
											req.flash('error', 'Server error. Please try again.');
											res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
										} else {
											language.version = version.global_version;
											language.save(function(err, lang) {
												if (err) {
													console.log(err);
													req.flash('error', 'Server error. Please try again.');
													res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
												} else {
													res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
												}
											});
										}	
									});
								}
							});	
						}
					} else { // No map uploaded
						language.ready = true;
						Version.findOneAndUpdate({ name: 'global'}, { $inc: {global_version: 1} }, function(err, version) {
							if (err) {
								console.log(err);
								req.flash('error', 'Server error. Please try again.');
								res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
							} else {
								language.version = version.global_version;
								language.save(function(err, lang) {
									if (err) {
										console.log(err);
										req.flash('error', 'Server error. Please try again.');
										res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
									} else {
										res.redirect(req.baseUrl + '/languages/' + language._id + '/edit');
									}
								});
							}	
						});
					}
				}
			});
		}
	});
	

	// Add new expression within a language
	router.post('/languages/expressions/new', function(req, res) {
		if (!req.body.english || !req.body.translation || !req.files.audio) {
			res.json({ 'error': 'Error. Missing a field.' });
		} else if (req.files.audio.extension !== 'mp3') {
			res.json({ 'error': 'Audio file not mp3.' });
		} else {
			var expression = new Expression();
			expression.english = req.body.english;
			expression.translation = req.body.translation;
			expression.language = req.body.language;
			var path = './uploads/' + req.files.audio.name;
			fs.writeFile(path, req.files.audio.buffer, function(err) {
				if (err) {
					console.log(err);
					res.json({ 'error': 'Server error. Try again' });
				} else {
					expression.audio = req.files.audio.name;
					Version.findOneAndUpdate({ name: 'global'}, { $inc: {global_version: 1} }, function(err, version) {
						if (err) {
							console.log(err);
							res.json({ 'error': 'Server error. Try again' });
						} else {
							expression.version = version.global_version;
							expression.save(function(err, expression) {
								if (err) {
									console.log(err);
									res.json({ 'error': 'Server error. Try again' });
								} else {
									res.json({ expression: expression });
								}
							});
						}
					});
				}
			});
		}
	});


	// Update existing expression in a language
	router.post('/languages/expressions/update', function(req, res) {
		if (req.body.action === 'Remove') {
			Version.findOneAndUpdate({name: 'global'}, {$inc: {global_version: 1}}, function(err, version) {
				if (err) {
					res.json({'error': 'Server error. Try again'});
				} else {
					Expression.findOneAndUpdate({_id: req.body.exprId}, 
						{ $set: {removed: true, version: version.global_version}}, function(err, expression) {
						if (err) {
							res.json({'error': 'Server error. Try again.'});
						} else {
							res.json({removed: 'Expression removed'});
						}
					});
				}
			});
		} else {
			Expression.findOne({ _id: req.body.exprId}, function(err, expression) {
				if (err) {
					res.json({'error': 'Server error. Try again.'});
				} else {
					if (req.body.english)
						expression.english = req.body.english;
					if (req.body.translation)
						expression.translation = req.body.translation;
					if (req.files.audio) {
						if (req.files.audio.extension !== 'mp3') {
							res.json({'error': 'Audio file not mp3'});
						} else {
							var path = './uploads/' + req.files.audio.name;
							fs.writeFile(path, req.files.audio.buffer, function(err) {
								if (err) {
									res.json({'error': 'Server error. Try again.'});
								} else {
									expression.audio = req.files.audio.name;
									Version.findOneAndUpdate({name: 'global'}, { $inc: {global_version: 1} }, function(err, version) {
										if (err) {
											res.json({'error': 'Server error. Try again.'});
										} else {
											expression.version = version.global_version;
											expression.save(function(err, expression) {
												if (err) {
													res.json({'error': 'Server error. Try again.'});
												} else {
													res.json({ expression: expression });
												}
											});
										}
									});
								}
							});
						}
					} else {
						Version.findOneAndUpdate({name: 'global'}, { $inc: {global_version: 1} }, function(err, version) {
							if (err) {
								res.json({'error': 'Server error. Try again!'});
							} else {
								expression.version = version.global_version;
								expression.save(function(err, expression) {
									if (err) {
										res.json({'error': 'Server error. Try again.'});
									} else {
										res.json({ expression: expression});
									}
								});
							}
						});
					}
				}
			});
		}
	});


	router.get('/users', function(req, res, next) {
		User.find(function(err, users) {
			if (err) {
				console.log(err)
				next(err);
			} else {
				res.render('dashboard/users', { users: users });
			}
		});
	});


	router.get('/expressions', function(req, res, next) {
		Expression.find({ removed: false }, function(err, expressions) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.render('dashboard/expressions', { expressions: expressions });
			}
		});
	});



	router.get('/expressions/new', function(req, res, next) {
		Language.find({ removed: false }, function(err, languages) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.render('dashboard/newexpressions', {
					languages: languages,
					english: req.flash('englishError'),
					translation: req.flash('translationError'),
					error: req.flash('error'),
				});
			}
		});
	});

	router.post('/expressions/new', function(req, res) {
		if (!req.body.english || !req.body.translation || !req.files.audio) {
			req.flash('englishError', req.body.english);
			req.flash('translationError', req.body.translation);
			req.flash('error', 'Error! There are empty fields.');
			res.redirect(req.originalUrl);
		} else {
			var expression = new Expression();
			expression.english = req.body.english;
			expression.translation = req.body.translation;
			expression.language = req.body.language;
			var path = './uploads/' + req.files.audio.name;
			fs.writeFile(path, req.files.audio.buffer, function(err) {
				if (err) {
					console.log(err);
					req.flash('englishError', req.body.english);
					req.flash('translationError', req.body.translation);
					req.flash('error', 'Error uploading the audio file. Try again.');
					res.redirect(req.originalUrl);
				} else {
					expression.audio = req.files.audio.name;
					Version.findOneAndUpdate({name: 'global'}, { $inc: {global_version: 1} }, function(err, version) {
						if (err) {
							console.log(err);
							req.flash('englishError', req.body.english);
							req.flash('translationError', req.body.translation);
							req.flash('error', 'Error occured creating expression. Submit again.')
							res.redirect(req.originalUrl);
						} else {
							expression.version = version.global_version;
							expression.save(function(err, expression) {
								if (err) {
									console.log(err);
									req.flash('englishError', req.body.english);
									req.flash('translationError', req.body.translation);
									req.flash('error', 'Error occured creating expression. Submit again.')
									res.redirect(req.originalUrl);
								} else {
									res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
								}
							});
						}
					});
				}
			});
		}
	});


	router.get('/expressions/:expr_id/edit', function(req, res, next) {
		Expression.findOne({_id: req.params.expr_id}, function(err, expression) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				res.render('dashboard/editexpressions', { 
					expression: expression,
					error: req.flash('error'), 
				});
			}
		});
	});

	router.post('/expressions/:expr_id/edit', function(req, res) {
		Expression.findOne({_id: req.params.expr_id}, function(err, expression) {
			if (err) {
				console.log(err);
				next(err);
			} else {
				if (req.body.english)
					expression.english = req.body.english;
				if (req.body.translation)
					expression.translation = req.body.translation;
				if (req.files.audio) {
					if (req.files.audio.extension !== 'mp3') {
						req.flash('error', 'Audio file not mp3 format.');
						res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
					} else {
						var path = './uploads/' + req.files.audio.name;
						fs.writeFile(path, req.files.audio.buffer, function(err) {
							if (err) {
								console.log(err);
								req.flash('error', 'Error in the server. Please try again.');
								res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
							} else {
								expression.audio = req.files.audio.name;
								Version.findOneAndUpdate({name: 'global'}, { $inc: {global_version: 1} }, function(err, version) {
									if (err) {
										console.log(err);
										req.flash('error', 'Error in the server. Please try again.');
										res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
									} else {
										expression.version = version.global_version;
										expression.save(function(err, expr) {
											if (err) {
												console.log(err);
												req.flash('error', 'Error in the server. Please try again.');
												res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
											} else {
												res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
											}
										});
									}
								});
							}
						});
					}
				} else { // Didnt upload audio file
					Version.findOneAndUpdate({name: 'global'}, { $inc: {global_version: 1} }, function(err, version) {
						if (err) {
							console.log(err);
							req.flash('error', 'Error in the server. Please try again.');
							res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
						} else {
							expression.version = version.global_version;
							expression.save(function(err, expr) {
								if (err) {
									console.log(err);
									req.flash('error', 'Error in the server. Please try again.');
									res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
								} else {
									res.redirect(req.baseUrl + '/expressions/' + expression._id + '/edit');
								}
							});
						}
					});
				}
			}
		});
	});
	


	router.get('/expressions/default', function(req, res) {
		res.render('dashboard/defaultexpressions');
	});

	router.get('/expressions/default/new', function(req, res) {
		res.render('dashboard/newdefaultexpressions', {
			error: req.flash('error'),
		});
	});

	router.post('/expressions/default/new', function(req, res) {
		var defaultExpression = new DefaultExpression();
		defaultExpression.english = req.body.english;
		defaultExpression.save(function(err, expression) {
			if (err) {
				console.log(err);
				req.flash('error', 'Error occured creating expression. Submit again.')
				res.redirect(req.originalUrl);
			} else {
				res.render('dashboard/expressions');
			}
		});
	});

	return router;

};


