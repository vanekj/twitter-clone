const profileTransform = require('./profile'),
	commentTransform = require('./comment'),
	likeTransform = require('./like');

module.exports = (tweet) => {
	if (typeof tweet === 'object' && tweet) {
		return {
			id: tweet._id,
			content: tweet.content,
			author: profileTransform(tweet.author),
			comments: tweet.comments.map(commentTransform),
			commentsCount: tweet.commentsCount,
			likes: tweet.likes.map(likeTransform),
			likesCount: tweet.likesCount,
			date: tweet.createdAt
		};
	} else {
		return tweet;
	}
};
