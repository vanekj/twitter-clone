module.exports = (profile) => {
	if (typeof profile === 'object' && profile) {
		return {
			firstName: profile.firstName,
			lastName: profile.lastName,
			fullName: `${profile.firstName} ${profile.lastName}`,
			nickname: profile.nickname
		};
	} else {
		return null;
	}
};
