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

/**
 * Handle user follow request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postUserFollow = async (request, response) => {
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
		await user.findByIdAndUpdate(response.locals.user._id, {
			$push: {
				following: foundUser._id
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
 * Handle user unfollow request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const deleteUserFollow = async (request, response) => {
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
		await user.findByIdAndUpdate(response.locals.user._id, {
			$pull: {
				following: foundUser._id
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
 * Handle random users list request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getRandom = async (request, response) => {
	try {
		let users = await user.aggregate([{
			$sample: {
				size: 3
			}
		}]);
		return response.json({
			status: 'success',
			payload: users
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
	getUserTweets,
	postUserFollow,
	deleteUserFollow,
	getRandom
};
