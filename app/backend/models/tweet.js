const mongoose = require('mongoose');

const contentSchemaType = {
	type: String,
	required: true,
	max: 256
};

const profileSchemaType = {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Profile'
};

const commentSchema = mongoose.Schema({
	content: contentSchemaType,
	author: profileSchemaType
}, {
	timestamps: true
});

const likeSchema = mongoose.Schema({
	author: profileSchemaType
}, {
	timestamps: true
});

const tweetSchema = mongoose.Schema({
	content: contentSchemaType,
	comments: [commentSchema],
	likes: [likeSchema],
	author: profileSchemaType
}, {
	timestamps: true
});

module.exports = mongoose.model('Tweet', tweetSchema);
