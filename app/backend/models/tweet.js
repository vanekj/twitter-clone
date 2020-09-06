const mongoose = require('mongoose');

const contentSchemaType = {
	type: String,
	required: true,
	max: 256
};

const createdAtSchemaType = {
	type: Date,
	default: Date.now
};

const profileSchemaType = {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Profile'
};

const commentSchemaType = {
	content: contentSchemaType,
	content_raw: contentSchemaType,
	author: profileSchemaType,
	createdAt: createdAtSchemaType
};

const likeSchemaType = {
	author: profileSchemaType,
	createdAt: createdAtSchemaType
};

const tweetSchema = mongoose.Schema({
	content: contentSchemaType,
	content_raw: contentSchemaType,
	comments: [commentSchemaType],
	likes: [likeSchemaType],
	author: profileSchemaType
}, {
	timestamps: true,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

tweetSchema.virtual('commentsCount').get(function() {
	return this.comments.length;
});

tweetSchema.virtual('likesCount').get(function() {
	return this.likes.length;
});

module.exports = mongoose.model('Tweet', tweetSchema);
