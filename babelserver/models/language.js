var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var LanguageSchema = new Schema({
	name: String,
	translations: [{
		_id: { type: String, unique: true, 'default': shortid.generate},
		original: { type: Schema.Types.ObjectId, ref: 'Expression' },
		translation: String,
		audio: String,
	}]
});

module.exports = mongoose.model('Language', LanguageSchema);