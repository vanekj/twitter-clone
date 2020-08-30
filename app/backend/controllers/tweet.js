const tweet = require('../models/tweet'),
	profile = require('../models/profile'),
	comment = require('../models/comment'),
	like = require('../models/like');

const tweetTransform = require('../transforms/tweet');

/**
 * Handle tweet creation request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postTweet = async (request, response) => {
	try {
		let tweetAuthor = await await profile.findOne({
			nickname: response.locals.auth.nickname
		});
		await tweet.create({
			content: request.body.content,
			author: tweetAuthor._id
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
		let foundTweets = await tweet.find().populate({
			path: 'author'
		});
		return response.json({
			status: 'success',
			payload: foundTweets.map(tweetTransform)
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
			path: 'comments',
			populate: {
				path: 'author'
			}
		}).populate({
			path: 'likes'
		});
		if (!foundTweet) {
			return response.status(404).json({
				status: 'error',
				message: 'Tweet not found'
			});
		}
		return response.json({
			status: 'success',
			payload: tweetTransform(foundTweet)
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
		let foundTweet = await tweet.findById(request.params.id);
		if (!foundTweet) {
			return response.status(404).json({
				status: 'error',
				message: 'Tweet not found'
			});
		}
		let createdComment = await comment.create({
			content: request.body.content,
			author: response.locals.auth.id,
			tweet: foundTweet._id
		});
		await foundTweet.update({
			$push: {
				comments: createdComment._id
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
		let foundTweet = await tweet.findById(request.params.id);
		if (!foundTweet) {
			return response.status(404).json({
				status: 'error',
				message: 'Tweet not found'
			});
		}
		let createdLike = await like.create({
			author: response.locals.auth.id,
			tweet: foundTweet._id
		});
		await foundTweet.update({
			$push: {
				likes: createdLike._id
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
	postTweetLike
};
