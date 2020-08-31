const sanitizer = require('../utils/sanitizer');

/**
 * Sanitizer middleware
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express callback function
 */
module.exports = (request, response, next) => {
	request.body = sanitizer.escapeObject(request.body);
	next();
};
