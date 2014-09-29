var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LanguageSchema = new Schema({
	name: String,
	translations: [{
		translation: { type: Schema.Types.ObjectId, ref: 'Expression' },
		meaning: String,
		audio: String,
	}]
});

module.exports = mongoose.model('Language', LanguageSchema);