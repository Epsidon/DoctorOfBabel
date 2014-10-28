var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var HistorySchema = new Schema({
	_id: { type: shortid, unique: true, 'default': shortid.generate },
	global_version: { type: Number, ref: 'Version' },
	changes: [shortid],
});

module.exports = mongoose.model('History', HistorySchema);