var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var ExpressionSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate},
	english: String,
	translation: String,
	audio: String,
	language: { type: String, ref: 'Language'},
});

module.exports = mongoose.model('Expression', ExpressionSchema);