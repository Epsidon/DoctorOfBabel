var mongoose = require('mongoose');
var shortid = require('shortid');
var Version = require('./version');
var Schema = mongoose.Schema;

var ExpressionSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate },
	english: String,
	translation: String,
	language: { type: String, ref: 'Language' },
	audioName: String,
	audioPath: String,
	audioMime: String,
	audioBin: { type: Buffer, select: false},
	pronunciation: String,
	version: Number,
	removed: { type: Boolean, 'default': false },
});

module.exports = mongoose.model('Expression', ExpressionSchema);