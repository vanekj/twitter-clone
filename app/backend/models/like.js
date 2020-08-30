const mongoose = require('mongoose');

const profileSchemaType = {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Profile'
};

const likeSchema = mongoose.Schema({
	author: profileSchemaType
}, {
	timestamps: true
});

module.exports = mongoose.model('Like', likeSchema);
