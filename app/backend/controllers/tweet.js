const tweet = require('../models/tweet');

/**
 * Handle tweet creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweet = async (request, response) => {
	try {
		await tweet.create({
			content: request.body.content,
			author: response.locals.auth.id
		});
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
		let foundTweets = await tweet.find().sort({
			createdAt: 'descending'
		}).populate({
			path: 'author'
		}).populate({
			path: 'comments.author'
		}).populate({
			path: 'likes.author'
		});
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
		let foundTweet = await tweet.findById(request.params.id).populate({
			path: 'author'
		}).populate({
			path: 'comments.author'
		}).populate({
			path: 'likes.author'
		});
		if (!foundTweet) {
			return response.status(404).json({
				status: 'error',
				message: 'Tweet not found'
			});
		}
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
 * Handle tweet comment creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweetComment = async (request, response) => {
	try {
		await tweet.findByIdAndUpdate(request.params.id, {
			$push: {
				comments: {
					content: request.body.content,
					author: response.locals.auth.id
				}
			}
		});
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
 * Handle tweet comment removal request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const deleteTweetComment = async (request, response) => {
	try {
		await tweet.findByIdAndUpdate(request.params.id, {
			$pull: {
				comments: {
					_id: request.params.commentId
				}
			}
		});
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
 * Handle tweet like creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweetLike = async (request, response) => {
	try {
		await tweet.findByIdAndUpdate(request.params.id, {
			$push: {
				likes: {
					author: response.locals.auth.id
				}
			}
		});
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
 * Handle tweet like removal request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const deleteTweetLike = async (request, response) => {
	try {
		await tweet.findOneAndUpdate({
			'likes.author': response.locals.auth.id
		}, {
			$pull: {
				likes: {
					author: response.locals.auth.id
				}
			}
		});
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

module.exports = {
	postTweet,
	getTweets,
	getTweet,
	postTweetComment,
	deleteTweetComment,
	postTweetLike,
	deleteTweetLike
};
