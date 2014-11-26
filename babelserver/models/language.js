var mongoose = require('mongoose');
var shortid = require('shortid');
var Version = require('./version');
var Schema = mongoose.Schema; 

var LanguageSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate},
	name: String,
	info: String,
	mapName: String,
	mapPath: String,
	mapMime: String,
	mapBin: { type: Buffer, select: false},
	version: Number,
	ready: { type: Boolean, 'default': false },
	removed: { type: Boolean, 'default': false },
});

module.exports = mongoose.model('Language', LanguageSchema);