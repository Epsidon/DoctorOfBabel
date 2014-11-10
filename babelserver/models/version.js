var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var VersionSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate },
	global_version: { type: Number, 'default': 1 },
	name: { type: String, 'default': 'global' },
});

module.exports = mongoose.model('Version', VersionSchema);