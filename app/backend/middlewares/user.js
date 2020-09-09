const user = require('../models/user');

/**
 * Load current auth user data
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express callback function
 */
module.exports = async (request, response, next) => {
	if (response.locals.auth && response.locals.auth._id) {
		Object.assign(response.locals, {
			user: await user.findById(response.locals.auth._id)
		});
	}
	next();
};
