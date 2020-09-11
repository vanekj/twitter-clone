const tweetRepository = require('../repositories/tweet'),
	userRepository = require('../repositories/user');

/**
 * Handle single user information request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getUser = async (request, response) => {
	try {
		let foundUser = await userRepository.get(request.params.username);
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
		let foundUser = await userRepository.get(request.params.username),
			foundTweets = await tweetRepository.get(null, [foundUser._id]);
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
		await userRepository.follow(response.locals.user.username, request.params.username);
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
		await userRepository.unfollow(response.locals.user.username, request.params.username);
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
		let foundUser = await userRepository.get(request.params.username),
			followers = await userRepository.getByIds(foundUser.followers);
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
		let foundUser = await userRepository.get(request.params.username),
			following = await userRepository.getByIds(foundUser.following);
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
		let topUsers = await userRepository.getTop([response.locals.user._id]);
		return response.json({
			status: 'success',
			payload: topUsers
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
