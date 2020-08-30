const profileSchema = require('./profile'),
	commentSchema = require('./comment');

module.exports = (tweet) => {
	if (typeof tweet === 'object' && tweet) {
		return {
			id: tweet._id,
			content: tweet.content,
			author: profileSchema(tweet.author),
			comments: tweet.comments.map(commentSchema),
			likes: tweet.likes
		};
	} else {
		return tweet;
	}
};
