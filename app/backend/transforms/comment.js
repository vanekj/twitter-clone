const profileTransform = require('./profile');

module.exports = (comment) => {
	if (typeof comment === 'object' && comment) {
		return {
			id: comment._id,
			content: comment.content,
			author: profileTransform(comment.author)
		};
	} else {
		return comment;
	}
};