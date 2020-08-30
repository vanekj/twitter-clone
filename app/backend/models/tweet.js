const mongoose = require('mongoose');

const contentSchemaType = {
	type: String,
	required: true,
	max: 256
};

const commentSchemaType = {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Comment'
};

const likeSchemaType = {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Like'
};

const profileSchemaType = {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Profile'
};

const tweetSchema = mongoose.Schema({
	content: contentSchemaType,
	comments: [commentSchemaType],
	likes: [likeSchemaType],
	author: profileSchemaType
}, {
	timestamps: true
});

tweetSchema.virtual('commentsCount').get(function() {
	return this.comments.length;
});

tweetSchema.virtual('likesCount').get(function() {
	return this.likes.length;
});

module.exports = mongoose.model('Tweet', tweetSchema);
