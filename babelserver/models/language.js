var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var LanguageSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate},
	name: String,
	info: String,
	map: String,
});

module.exports = mongoose.model('Language', LanguageSchema);