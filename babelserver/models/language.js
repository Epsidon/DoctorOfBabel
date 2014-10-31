var mongoose = require('mongoose');
var shortid = require('shortid');
var Version = require('./version');
var Schema = mongoose.Schema;

var LanguageSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate},
	name: String,
	info: String,
	map: String,
	version: Number,
});

LanguageSchema.pre('save', function(next) {
	var language = this;
	Version.findOneAndUpdate({ name: 'global' }, { $inc: { global_version: 1 }}, function(err, version) {
		if (err) {
			next(err);
		} else {
			language.version = version.global_version;
			next();
		}
	});
});

module.exports = mongoose.model('Language', LanguageSchema);