const bcrypt = require('bcryptjs');

const profile = require('../models/profile'),
	profileSchema = require('../schemas/profile');

/**
 * Handle profile registration request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postRegistration = async (request, response) => {
	try {
		let password = request.body.password,
			confirmPassword = request.body.confirmPassword;
		if (password !== confirmPassword) {
			return response.status(400).json({
				status: 'error',
				message: 'Passwords don\'t match'
			});
		}
		let hashedPassword = await bcrypt.hash(password, 10);
		await profile.create({
			...request.body,
			password: hashedPassword
		});
		return response.json({
			status: 'success',
			message: 'Registration successfull'
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle profile login request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postLogin = async (request, response) => {
	try {
		let foundProfile = await profile.findOne({
			nickname: request.body.nickname
		});
		if (!foundProfile) {
			return response.status(404).json({
				status: 'error',
				message: 'Profile not found'
			});
		}
		let profilePassword = foundProfile.password,
			requestPassword = request.body.password,
			passwordsMatch = await bcrypt.compare(requestPassword, profilePassword);
		if (!passwordsMatch) {
			return response.status(400).json({
				status: 'error',
				message: 'Incorrect password'
			});
		}
		return response.json({
			status: 'success',
			message: 'Login successfull',
			payload: profileSchema(foundProfile)
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

module.exports = {
	postRegistration,
	postLogin
};
