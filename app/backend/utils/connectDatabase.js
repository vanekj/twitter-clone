const mongoose = require('mongoose');

/**
 * Connect to Mongo database
 * @param {String} mongoUri Mongo database connection URI
 * @returns {Promise} Mongoose connection instance
 */
module.exports = (mongoUri) => {
	return mongoose.connect(mongoUri, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true
	});
};
