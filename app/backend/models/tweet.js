const mongoose = require('mongoose');

const schema = mongoose.Schema({
	content: {
		type: String,
		required: true,
		max: 256
	},
	comments: [{
		content: {
			type: String,
			required: true,
			max: 256
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Profile'
		}
	}],
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Profile'
	}],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Profile'
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Tweet', schema);
