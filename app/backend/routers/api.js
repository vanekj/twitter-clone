const express = require('express');

const config = require('../config');

const authController = require('../controllers/auth'),
	authMiddleware = require('../middlewares/auth');

const apiRouter = express.Router();

/**
 * Use auth middleware
 */
apiRouter.use(authMiddleware(config.jwtSecret).unless({
	path: [
		'/api/auth/registration',
		'/api/auth/login'
	]
}));

/**
 * Handle profile registration request
 */
apiRouter.post('/auth/registration', authController.postRegistration);

/**
 * Handle profile login request
 */
apiRouter.post('/auth/login', authController.postLogin);

/**
 * 404 response for all requests that did not match any of the API paths
 */
apiRouter.all('*', (request, response) => {
	response.status(404).json({
		status: 'error',
		message: 'No action for the request'
	});
});

/**
 * Handle errors
 */
apiRouter.use((error, request, response, next) => {
	if (response.headersSent) {
		next(error);
	} else if (error.name === 'UnauthorizedError') {
		response.status(401).send({
			status: 'error',
			message: 'Invalid or expired token'
		});
	} else {
		response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
});

module.exports = apiRouter;
