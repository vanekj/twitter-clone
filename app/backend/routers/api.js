const express = require('express');

const apiRouter = express.Router();

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
