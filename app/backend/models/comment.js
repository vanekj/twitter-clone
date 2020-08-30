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

module.exports = mongoose.model('Comment', commentSchema);
