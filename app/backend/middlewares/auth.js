const expressJwt = require('express-jwt');

/**
 * Create middleware for JWT auth
 * @param {String} secret Secret for JWT middleware
 */
module.exports = (secret) => expressJwt({
	secret,
	algorithms: ['HS256'],
	resultProperty: 'locals.auth'
});
