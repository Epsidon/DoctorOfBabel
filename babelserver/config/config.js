module.exports = function(app) {
	var config = {};

	config.DB_URL = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/babel';
	config.SESSION_KEY = process.env.SESSION_KEY || 
									'this is a key for the sessions and it should be long enough'

	if (app.get('env') === 'development') {
		var keys = require('./keys');
		config.S3_ACCESS_KEY = keys.S3_ACCESS_KEY;
		config.S3_SECRET_KEY = keys.S3_SECRET_KEY;
	} else {
		config.S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
		config.S3_SECRET_KEY = process.env.S3_SECRET_KEY;
	}	

	config.S3_BUCKET = 'doctorofbabel';

	return config;
};