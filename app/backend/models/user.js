const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	timestamps: true,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

profileSchema.virtual('fullName').get(function() {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Profile', profileSchema);
