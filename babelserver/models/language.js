var mongoose = require('mongoose');
var shortid = require('shortid');
var Version = require('./version');
var Schema = mongoose.Schema;

var LanguageSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate},
	name: String,
	info: String,
	map: String,
});

ExpressionSchema.pre('save', function(next) {
	Version.findOneAndUpdate({ name: 'global' }, { $inc: { global_version: 1 }}, function(err) {
		if (err)
			next(err);
		next();
	});
});

module.exports = mongoose.model('Language', LanguageSchema);