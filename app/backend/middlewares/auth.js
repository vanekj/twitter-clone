const expressJwt = require('express-jwt');

/**
 * Create middleware for JWT auth
 * @param {Object} options JWT configuration options
 * @param {String} options.secret Secret for JWT middleware
 * @param {String} options.algorithm JWT sign algorithm
 */
module.exports = ({ secret, algorithm }) => expressJwt({
	secret,
	algorithms: [algorithm],
	resultProperty: 'locals.auth'
});
