export const state = () => ({
	tweets: [],
	user: null
});

export const mutations = {
	SET_TWEETS(state, tweets) {
		state.tweets = [...tweets];
	},
	UPDATE_TWEET(state, updatedTweet) {
		state.tweets = state.tweets.map((tweet) => {
			return tweet._id === updatedTweet._id ? updatedTweet : tweet;
		});
	},
	DELETE_TWEET(state, deletedTweetId) {
		state.tweets = state.tweets.filter((tweet) => tweet._id !== deletedTweetId);
	},
	SET_USER(state, user) {
		state.user = Object.assign({}, user);
	}
};

export const actions = {
	async addTweet(store, { tweetData }) {
		await this.$axios.post('/api/tweet', tweetData);
	},
	async getTweets({ commit }) {
		let response = await this.$axios.get('/api/tweet');
		commit('SET_TWEETS', response.data.payload);
	},
	async getTweet({ commit }, { tweetId }) {
		let response = await this.$axios.get(`/api/tweet/${tweetId}`);
		commit('SET_TWEETS', [response.data.payload]);
	},
	async deleteTweet({ commit }, { tweetId }) {
		await this.$axios.delete(`/api/tweet/${tweetId}`);
		commit('DELETE_TWEET', tweetId);
	},
	async addTweetLike({ commit }, { tweetId }) {
		let response = await this.$axios.post(`/api/tweet/${tweetId}/like`);
		commit('UPDATE_TWEET', response.data.payload);
	},
	async deleteTweetLike({ commit }, { tweetId }) {
		let response = await this.$axios.delete(`/api/tweet/${tweetId}/like`);
		commit('UPDATE_TWEET', response.data.payload);
	},
	async addTweetComment({ commit }, { tweetId, commentData }) {
		let response = await this.$axios.post(`/api/tweet/${tweetId}/comment`, commentData);
		commit('UPDATE_TWEET', response.data.payload);
	},
	async deleteTweetComment({ commit }, { tweetId, commentId }) {
		let response = await this.$axios.delete(`/api/tweet/${tweetId}/comment/${commentId}`);
		commit('UPDATE_TWEET', response.data.payload);
	},
	async getUser({ commit }, { username }) {
		let response = await this.$axios.get(`/api/user/${username}`);
		commit('SET_USER', response.data.payload);
	},
	async getUserTweets({ commit }, { username }) {
		let response = await this.$axios.get(`/api/user/${username}/tweet`);
		commit('SET_TWEETS', response.data.payload);
	},
	async followUser(store, { username }) {
		await this.$axios.post(`/api/user/${username}/follow`);
		await this.$auth.fetchUser();
	},
	async unfollowUser(store, { username }) {
		await this.$axios.delete(`/api/user/${username}/follow`);
		await this.$auth.fetchUser();
	}
};

export const getters = {
	getSingleTweet: (state) => (tweetId) => {
		return state.tweets.find((tweet) => tweet._id === tweetId);
	}
};
