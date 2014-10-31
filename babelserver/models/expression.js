var mongoose = require('mongoose');
var shortid = require('shortid');
var Version = require('./version');
var Schema = mongoose.Schema;

var ExpressionSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate},
	english: String,
	translation: String,
	audio: String,
	language: { type: String, ref: 'Language'},
	pronunciation: String,
});

ExpressionSchema.pre('save', function(next) {
	Version.findOneAndUpdate({ name: 'global' }, { $inc: { global_version: 1 }}, function(err) {
		if (err)
			next(err);
		next();
	});
});

module.exports = mongoose.model('Expression', ExpressionSchema);