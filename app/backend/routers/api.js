const express = require('express');

const config = require('../config');

const authMiddleware = require('../middlewares/auth'),
	sanitizeMiddleware = require('../middlewares/sanitize');

const authController = require('../controllers/auth'),
	tweetController = require('../controllers/tweet'),
	userController = require('../controllers/user');

const apiRouter = express.Router();

/**
 * Use body sanitizing middleware
 */
apiRouter.use(sanitizeMiddleware);

/**
 * Use auth middleware
 */
apiRouter.use(authMiddleware(config.jwt).unless({
	path: [
		'/api/auth/registration',
		'/api/auth/login'
	]
}));

/**
 * Handle user registration request
 */
apiRouter.post('/auth/registration', authController.postRegistration);

/**
 * Handle user login request
 */
apiRouter.post('/auth/login', authController.postLogin);

/**
 * Handle user information request
 */
apiRouter.get('/auth/me', authController.getMe);

/**
 * Handle tweet creation request
 */
apiRouter.post('/tweet', tweetController.postTweet);

/**
 * Handle tweet list request
 */
apiRouter.get('/tweet', tweetController.getTweets);

/**
 * Handle single tweet list request
 */
apiRouter.get('/tweet/:id', tweetController.getTweet);

/**
 * Handle tweet removal request
 */
apiRouter.delete('/tweet/:id', tweetController.deleteTweet);

/**
 * Handle tweet comment creation request
 */
apiRouter.post('/tweet/:id/comment', tweetController.postTweetComment);

/**
 * Handle tweet comment removal request
 */
apiRouter.delete('/tweet/:id/comment/:commentId', tweetController.deleteTweetComment);

/**
 * Handle tweet like creation request
 */
apiRouter.post('/tweet/:id/like', tweetController.postTweetLike);

/**
 * Handle tweet like removal request
 */
apiRouter.delete('/tweet/:id/like', tweetController.deleteTweetLike);

/**
 * Handle single user information request
 */
apiRouter.get('/user/:username', userController.getUser);

/**
 * Handle single user tweets list request
 */
apiRouter.get('/user/:username/tweet', userController.getUserTweets);

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
