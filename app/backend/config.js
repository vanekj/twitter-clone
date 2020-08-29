const path = require('path');

// Set env variables
const isProduction = process.env.NODE_ENV === 'production',
	isDevelopment = !isProduction;

// Load env variables from .env when on development
if (isDevelopment) {
	require('dotenv').config({ // eslint-disable-line global-require
		path: path.join(__dirname, '../../.env')
	});
}

// JWT configuration
const jwt = {
	algorithm: 'HS256',
	secret: process.env.JWT_SECRET
};

// Set config; Init server models
module.exports = {
	isDevelopment,
	isProduction,
	jwt,
	port: process.env.PORT || 80,
	mongoUri: process.env.MONGO_URI,
	staticPath: path.join(__dirname, '../shared/static')
};
