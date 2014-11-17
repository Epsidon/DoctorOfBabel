var config = {};

config.DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/babel';
config.SESSION_KEY = process.env.SESSION_KEY || 
								'this is a key for the sessions and it should be long enough']


module.exports = config;