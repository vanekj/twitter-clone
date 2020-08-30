const profileSchema = require('./profile');

module.exports = (like) => {
	if (typeof like === 'object' && like) {
		return {
			id: like._id,
			author: profileSchema(like.author)
		};
	} else {
		return like;
	}
};
