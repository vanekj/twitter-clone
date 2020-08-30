const tweet = require('../models/tweet'),
	profile = require('../models/profile'),
	tweetSchema = require('../schemas/tweet');

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
		let createdTweet = await tweet.create({
			content: request.body.content,
			author: tweetAuthor._id
		});
		return response.json({
			status: 'success',
			payload: tweetSchema(createdTweet)
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
		let foundTweets = await tweet.find().populate('author');
		return response.json({
			status: 'success',
			payload: foundTweets.map(tweetSchema)
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
		let foundTweet = await tweet.findById(request.params.id).populate('author');
		return response.json({
			status: 'success',
			payload: tweetSchema(foundTweet)
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
	getTweet
};
