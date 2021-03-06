const mongoose = require('mongoose');

const profileSchemaType = {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Profile'
};

const incrementingNumberSchemaType = {
	type: Number,
	default: 0
};

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
	},
	followers: [profileSchemaType],
	followersCount: incrementingNumberSchemaType,
	following: [profileSchemaType],
	followingCount: incrementingNumberSchemaType
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
