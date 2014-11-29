var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var DefaultExpressionSchema = new Schema({
	_id: { type: String, unique: true, 'default': shortid.generate },
	english: String,
});

module.exports = mongoose.model('DefaultExpression', DefaultExpressionSchema);