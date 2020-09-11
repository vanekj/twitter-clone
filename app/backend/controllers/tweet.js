const tweetRepository = require('../repositories/tweet');

/**
 * Handle tweet creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweet = async (request, response) => {
	try {
		await tweetRepository.create(request.body, response.locals.user._id);
		return response.json({
			status: 'success'
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle tweet list request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getTweets = async (request, response) => {
	try {
		let foundTweets = await tweetRepository.get(null, [
			...response.locals.user.following,
			response.locals.user._id
		]);
		return response.json({
			status: 'success',
			payload: foundTweets
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle single tweet list request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getTweet = async (request, response) => {
	try {
		let foundTweet = await tweetRepository.get(request.params.id);
		return response.json({
			status: 'success',
			payload: foundTweet
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle tweet removal request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const deleteTweet = async (request, response) => {
	try {
		await tweetRepository.remove(request.params.id, response.locals.user._id);
		return response.json({
			status: 'success'
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle tweet comment creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweetComment = async (request, response) => {
	try {
		let commentedTweet = await tweetRepository.addComment(request.params.id, request.body, response.locals.user._id);
		return response.json({
			status: 'success',
			payload: commentedTweet
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle tweet comment removal request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const deleteTweetComment = async (request, response) => {
	try {
		let updatedTweet = await tweetRepository.removeComment(request.params.id, request.params.commentId, response.locals.user._id);
		return response.json({
			status: 'success',
			payload: updatedTweet
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle tweet like creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweetLike = async (request, response) => {
	try {
		let updatedTweet = await tweetRepository.addLike(request.params.id, response.locals.user._id);
		return response.json({
			status: 'success',
			payload: updatedTweet
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle tweet like removal request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const deleteTweetLike = async (request, response) => {
	try {
		let updatedTweet = await tweetRepository.removeLike(request.params.id, response.locals.user._id);
		return response.json({
			status: 'success',
			payload: updatedTweet
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

module.exports = {
	postTweet,
	getTweets,
	getTweet,
	deleteTweet,
	postTweetComment,
	deleteTweetComment,
	postTweetLike,
	deleteTweetLike
};
