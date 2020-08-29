module.exports = (profile) => ({
	firstName: profile.firstName,
	lastName: profile.lastName,
	fullName: `${profile.firstName} ${profile.lastName}`,
	nickname: profile.nickname
});
