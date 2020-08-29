const express = require('express');

const authController = require('../controllers/auth');

const apiRouter = express.Router();

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

module.exports = apiRouter;
