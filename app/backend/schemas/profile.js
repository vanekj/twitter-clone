module.exports = (profile) => {
	if (typeof profile === 'object' && profile) {
		return {
			id: profile.id,
			firstName: profile.firstName,
			lastName: profile.lastName,
			fullName: profile.fullName,
			nickname: profile.nickname
		};
	} else {
		return profile;
	}
};
