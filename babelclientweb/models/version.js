var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VersionSchema = new Schema({
	global_version: { type: Number, 'default': 1 },
	name: { type: String, 'default': 'global' },
});

module.exports = mongoose.model('Version', VersionSchema);