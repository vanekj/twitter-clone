const user = require('../models/user'),
	tweet = require('../models/tweet');

/**
 * Handle single user information request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getUser = async (request, response) => {
	try {
		let foundUser = await user.findOne({
			username: request.params.username
		});
		if (!foundUser) {
			return response.status(404).json({
				status: 'error',
				message: 'User not found'
			});
		}
		return response.json({
			status: 'success',
			payload: foundUser
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle single user tweets list request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getUserTweets = async (request, response) => {
	try {
		let foundUser = await user.findOne({
			username: request.params.username
		});
		if (!foundUser) {
			return response.status(404).json({
				status: 'error',
				message: 'User not found'
			});
		}
		let foundTweets = await tweet.find({
			author: foundUser._id
		}).sort({
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

module.exports = {
	getUser,
	getUserTweets
};