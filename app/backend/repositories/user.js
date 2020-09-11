const user = require('../models/user');

const NotFoundException = require('../exceptions/notFound');

/**
 * Get all users or single user by username
 * @param {String} [username] Account username
 * @returns {Promise<Object|Object[]>}
 */
const get = async (username) => {
	if (typeof username === 'string') {
		let foundUser = await user.findOne({
			username
		});
		if (!foundUser) {
			throw new NotFoundException('User not found');
		}
		return foundUser;
	} else {
		let foundUsers = await user.find();
		return foundUsers;
	}
};

/**
 * Get users by array of IDs
 * @param {String[]} ids Array of account IDs to list
 * @returns {Promise<Object[]>}
 */
const getByIds = async (ids) => {
	let foundUsers = await user.find({
		_id: {
			$in: ids
		}
	});
	return foundUsers;
};

/**
 * Get users by array of usernames
 * @param {String[]} usernames Array of account usernames to list
 * @returns {Promise<Object[]>}
 */
const getByUsernames = async (usernames) => {
	let foundUsers = await user.find({
		username: {
			$in: usernames
		}
	});
	return foundUsers;
};

/**
 * Get most follower users
 * @param {String[]} ignoredIds Array of ignored accounts IDs
 * @param {Number} [limit=3] Limit of the results
 * @returns {Promise<Object[]>}
 */
const getTop = async (ignoredIds, limit = 3) => {
	let users = await user.find({
		_id: {
			$ne: ignoredIds
		}
	}).sort([
		['followersCount', 'descending'],
		['createdAt', 'ascending']
	]).limit(limit);
	return users;
};

/**
 * Follow target account by follower account
 * @param {String} targetUsername Who recieves the follower
 * @param {String} followerUsername Who is the new follower
 * @returns {Promise}
 */
const follow = async (targetUsername, followerUsername) => {
	let [targetUser, followerUser] = await Promise.all([
		get(targetUsername),
		get(followerUsername)
	]);
	await Promise.all([
		user.findByIdAndUpdate(targetUser._id, {
			$push: {
				following: followerUser._id
			},
			$inc: {
				followingCount: 1
			}
		}),
		user.findByIdAndUpdate(followerUser._id, {
			$push: {
				followers: targetUser._id
			},
			$inc: {
				followersCount: 1
			}
		})
	]);
};

/**
 * Unfollow target account by follower account
 * @param {String} targetUsername Who losts the follower
 * @param {String} followerUsername Who is the lost follower
 * @returns {Promise}
 */
const unfollow = async (targetUsername, followerUsername) => {
	let [targetUser, followerUser] = await Promise.all([
		get(targetUsername),
		get(followerUsername)
	]);
	await Promise.all([
		user.findByIdAndUpdate(targetUser._id, {
			$pull: {
				following: followerUser._id
			},
			$inc: {
				followingCount: -1
			}
		}),
		user.findByIdAndUpdate(followerUser._id, {
			$pull: {
				followers: targetUser._id
			},
			$inc: {
				followersCount: -1
			}
		})
	]);
};

module.exports = {
	get,
	getByIds,
	getByUsernames,
	getTop,
	follow,
	unfollow
};
