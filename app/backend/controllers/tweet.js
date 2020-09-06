const tweet = require('../models/tweet'),
	user = require('../models/user');

/**
 * Handle tweet creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweet = async (request, response) => {
	try {
		let foundUsernames = (request.body.content.match(/@(\w+)/g) || []).map((match) => match.substring(1)),
			foundUsers = await user.find({
				username: {
					$in: foundUsernames
				}
			}),
			contentWithMentions = Object.values(foundUsers).reduce((content, user) => {
				let searchPattern = new RegExp(`@(${user.username})`, 'g');
				return content.replace(searchPattern, '[@$1](/u/$1)');
			}, request.body.content);
		await tweet.create({
			content: contentWithMentions,
			content_raw: request.body.content,
			author: response.locals.auth._id
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
 * Handle tweet removal request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const deleteTweet = async (request, response) => {
	try {
		await tweet.findOneAndRemove({
			_id: request.params.id,
			author: response.locals.auth._id
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
 * Handle tweet comment creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweetComment = async (request, response) => {
	try {
		let foundUsernames = (request.body.content.match(/@(\w+)/g) || []).map((match) => match.substring(1)),
			foundUsers = await user.find({
				username: {
					$in: foundUsernames
				}
			}),
			contentWithMentions = Object.values(foundUsers).reduce((content, user) => {
				let searchPattern = new RegExp(`@(${user.username})`, 'g');
				return content.replace(searchPattern, '[@$1](/u/$1)');
			}, request.body.content);
		await tweet.findByIdAndUpdate(request.params.id, {
			$push: {
				comments: {
					content: contentWithMentions,
					content_raw: request.body.content,
					author: response.locals.auth._id
				}
			}
		});
		let updatedTweet = await tweet.findById(request.params.id).populate({
			path: 'author'
		}).populate({
			path: 'comments.author'
		}).populate({
			path: 'likes.author'
		});
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
 * Handle tweet comment removal request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const deleteTweetComment = async (request, response) => {
	try {
		await tweet.findOneAndUpdate({
			_id: request.params.id,
			'comments.author': response.locals.auth._id
		}, {
			$pull: {
				comments: {
					_id: request.params.commentId
				}
			}
		});
		let updatedTweet = await tweet.findById(request.params.id).populate({
			path: 'author'
		}).populate({
			path: 'comments.author'
		}).populate({
			path: 'likes.author'
		});
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
		await tweet.findByIdAndUpdate(request.params.id, {
			$push: {
				likes: {
					author: response.locals.auth._id
				}
			}
		});
		let updatedTweet = await tweet.findById(request.params.id).populate({
			path: 'author'
		}).populate({
			path: 'comments.author'
		}).populate({
			path: 'likes.author'
		});
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
		await tweet.findOneAndUpdate({
			_id: request.params.id,
			'likes.author': response.locals.auth._id
		}, {
			$pull: {
				likes: {
					author: response.locals.auth._id
				}
			}
		});
		let updatedTweet = await tweet.findById(request.params.id).populate({
			path: 'author'
		}).populate({
			path: 'comments.author'
		}).populate({
			path: 'likes.author'
		});
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
