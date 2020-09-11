const tweet = require('../models/tweet');

const userRepository = require('./user');

const NotFoundException = require('../exceptions/notFound');

/**
 * Search for mentions in given string and return replaced with links
 * @param {String} content Tweet content, comment message, etc.
 * @returns {Promise<String>}
 */
const _findMentions = async (content) => {
	let foundUsernames = (content.match(/@(\w+)/g) || []).map((match) => match.substring(1)),
		foundUsers = await userRepository.getByUsernames(foundUsernames);
	return Object.values(foundUsers).reduce((content, user) => {
		let searchPattern = new RegExp(`@(${user.username})`, 'g');
		return content.replace(searchPattern, '<a href="/u/$1">@$1</a>');
	}, content);
};

/**
 * Create new tweet
 * @param {Object} data Tweet data
 * @param {String} authorId Tweet author ID
 * @returns {Promise}
 */
const create = async (data, authorId) => {
	let contentWithMentions = await _findMentions(data.content);
	await tweet.create({
		content: contentWithMentions,
		content_raw: data.content,
		author: authorId
	});
};

/**
 * Get all tweets or single tweet by its ID
 * @param {(String|null)} [tweetId] Tweet ID
 * @param {String[]} [userIds] ID of user to get the tweets from
 * @returns {Promise<Object|Object[]>}
 */
const get = async (tweetId, userIds) => {
	let findPromise;
	if (typeof tweetId === 'string') {
		findPromise = tweet.findById(tweetId);
	} else if (Array.isArray(userIds)) {
		findPromise = tweet.find({
			author: {
				$in: userIds
			}
		});
	} else {
		findPromise = tweet.find();
	}
	let result = await findPromise.sort({
		createdAt: 'descending'
	}).populate({
		path: 'author'
	}).populate({
		path: 'comments.author'
	}).populate({
		path: 'likes.author'
	});
	if (typeof tweetId === 'string' && !result) {
		throw new NotFoundException('Tweet not found');
	}
	return result;
};

/**
 * Remove tweet by it's ID and author
 * @param {String} tweetId Tweet ID
 * @param {String} authorId Tweet author ID
 * @returns {Promise}
 */
const remove = async (tweetId, authorId) => {
	await tweet.findOneAndRemove({
		_id: tweetId,
		author: authorId
	});
};

/**
 * Add tweet comment
 * @param {String} tweetId Commented tweet ID
 * @param {Object} commentData Comment data
 * @param {String} authorId Comment author ID
 * @returns {Promise<Object>} Updated tweet
 */
const addComment = async (tweetId, commentData, authorId) => {
	let contentWithMentions = await _findMentions(commentData.content);
	await tweet.findByIdAndUpdate(tweetId, {
		$push: {
			comments: {
				content: contentWithMentions,
				content_raw: commentData.content,
				author: authorId
			}
		}
	});
	let updatedTweet = await get(tweetId);
	return updatedTweet;
};

/**
 * Delete tweet comment
 * @param {String} tweetId Commented tweet ID
 * @param {String} commentId Comment ID
 * @param {String} authorId Comment author ID
 * @returns {Promise<Object>} Updated tweet
 */
const removeComment = async (tweetId, commentId, authorId) => {
	await tweet.findOneAndUpdate({
		_id: tweetId,
		'comments.author': authorId
	}, {
		$pull: {
			comments: {
				_id: commentId
			}
		}
	});
	let updatedTweet = await get(tweetId);
	return updatedTweet;
};

/**
 * Add tweet like
 * @param {String} tweetId Commented tweet ID
 * @param {String} authorId Comment author ID
 * @returns {Promise<Object>} Updated tweet
 */
const addLike = async (tweetId, authorId) => {
	await tweet.findByIdAndUpdate(tweetId, {
		$push: {
			likes: {
				author: authorId
			}
		}
	});
	let updatedTweet = await get(tweetId);
	return updatedTweet;
};

/**
 * Delete tweet like
 * @param {String} tweetId Commented tweet ID
 * @param {String} authorId Comment author ID
 * @returns {Promise<Object>} Updated tweet
 */
const removeLike = async (tweetId, authorId) => {
	await tweet.findOneAndUpdate({
		_id: tweetId,
		'likes.author': authorId
	}, {
		$pull: {
			likes: {
				author: authorId
			}
		}
	});
	let updatedTweet = await get(tweetId);
	return updatedTweet;
};

module.exports = {
	create,
	get,
	remove,
	addComment,
	removeComment,
	addLike,
	removeLike
};
