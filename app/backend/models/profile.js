const mongoose = require('mongoose');

const schema = mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	nickname: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

schema.virtual('fullName').get(function() {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Profile', schema);
