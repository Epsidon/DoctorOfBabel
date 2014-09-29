var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExpressionSchema = new Schema({
	sentence: String,
});

module.exports = mongoose.model('Expression', ExpressionSchema);