const profileSchema = require('./profile'),
	commentSchema = require('./comment'),
	likeSchema = require('./like');

module.exports = (tweet) => {
	if (typeof tweet === 'object' && tweet) {
		return {
			id: tweet._id,
			content: tweet.content,
			author: profileSchema(tweet.author),
			comments: tweet.comments.map(commentSchema),
			likes: tweet.likes.map(likeSchema)
		};
	} else {
		return tweet;
	}
};
