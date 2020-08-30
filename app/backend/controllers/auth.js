const bcrypt = require('bcryptjs'),
	jsonwebtoken = require('jsonwebtoken');

const config = require('../config'),
	profile = require('../models/profile'),
	profileTransform = require('../transforms/profile');

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
			firstName: request.body.firstName,
			lastName: request.body.lastName,
			nickname: request.body.nickname,
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
		let cleanProfile = profileTransform(foundProfile),
			generatedToken = jsonwebtoken.sign(cleanProfile, config.jwt.secret, {
				algorithm: config.jwt.algorithm,
				expiresIn: '7 days'
			});
		return response.json({
			status: 'success',
			message: 'Login successfull',
			payload: {
				profile: cleanProfile,
				token: generatedToken
			}
		});
	} catch (error) {
		return response.status(error.status || 500).json({
			status: 'error',
			message: error.message || 'Unexpected error'
		});
	}
};

/**
 * Handle profile information request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getMe = async (request, response) => {
	try {
		let foundProfile = await profile.findOne({
			nickname: response.locals.auth.nickname
		});
		return response.json({
			status: 'success',
			payload: profileTransform(foundProfile)
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
	postLogin,
	getMe
};
