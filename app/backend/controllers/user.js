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
		await Promise.all([
			user.findByIdAndUpdate(response.locals.user._id, {
				$push: {
					following: foundUser._id
				},
				$inc: {
					followingCount: 1
				}
			}),
			user.findByIdAndUpdate(foundUser._id, {
				$push: {
					followers: response.locals.user._id
				},
				$inc: {
					followersCount: 1
				}
			})
		]);
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
		await Promise.all([
			user.findByIdAndUpdate(response.locals.user._id, {
				$pull: {
					following: foundUser._id
				},
				$inc: {
					followingCount: -1
				}
			}),
			user.findByIdAndUpdate(foundUser._id, {
				$pull: {
					followers: response.locals.user._id
				},
				$inc: {
					followersCount: -1
				}
			})
		]);
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
 * Handle user followers list request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getFollowers = async (request, response) => {
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
		let followers = await user.find({
			_id: {
				$in: foundUser.followers
			}
		});
		return response.json({
			status: 'success',
			payload: followers
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle user following list request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getFollowing = async (request, response) => {
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
		let following = await user.find({
			_id: {
				$in: foundUser.following
			}
		});
		return response.json({
			status: 'success',
			payload: following
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle top users list request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getTop = async (request, response) => {
	try {
		let users = await user.find({
			_id: {
				$ne: response.locals.user._id
			}
		}).sort([
			['followersCount', 'descending'],
			['createdAt', 'ascending']
		]).limit(3);
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
	getFollowers,
	getFollowing,
	getTop
};
