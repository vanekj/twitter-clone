const bcrypt = require('bcryptjs'),
	jsonwebtoken = require('jsonwebtoken');

const config = require('../config'),
	user = require('../models/user');

/**
 * Handle user registration request
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
		await user.create({
			firstName: request.body.firstName,
			lastName: request.body.lastName,
			username: request.body.username,
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
 * Handle user login request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const postLogin = async (request, response) => {
	try {
		let foundUser = await user.findOne({
			username: request.body.username
		});
		if (!foundUser) {
			return response.status(404).json({
				status: 'error',
				message: 'User not found'
			});
		}
		let userPassword = foundUser.password,
			requestPassword = request.body.password,
			passwordsMatch = await bcrypt.compare(requestPassword, userPassword);
		if (!passwordsMatch) {
			return response.status(400).json({
				status: 'error',
				message: 'Incorrect password'
			});
		}
		let generatedToken = jsonwebtoken.sign({
			_id: foundUser._id,
			username: foundUser.username
		}, config.jwt.secret, {
			algorithm: config.jwt.algorithm,
			expiresIn: '7 days'
		});
		return response.json({
			status: 'success',
			message: 'Login successfull',
			payload: {
				user: foundUser,
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
 * Handle user information request
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 */
const getMe = async (request, response) => {
	try {
		let foundUser = await user.findById(response.locals.auth._id);
		return response.json({
			status: 'success',
			payload: foundUser
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
