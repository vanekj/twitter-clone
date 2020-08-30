const profileTransform = require('./profile');

module.exports = (like) => {
	if (typeof like === 'object' && like) {
		return {
			id: like._id,
			author: profileTransform(like.author),
			date: like.createdAt
		};
	} else {
		return like;
	}
};
