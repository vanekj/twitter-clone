const profileSchema = require('./profile');

module.exports = (tweet) => {
	if (typeof tweet === 'object' && tweet) {
		return {
			id: tweet._id,
			content: tweet.content,
			author: profileSchema(tweet.author),
			comments: tweet.comments,
			likes: tweet.likes
		};
	} else {
		return tweet;
	}
};
