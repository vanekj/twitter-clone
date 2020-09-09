<template>
	<b-row class="h-100">
		<b-col />
		<b-col cols="3">
			<t-profile :is-current-user="isCurrentUser" :user="user" @follow-user="onFollowChange" @unfollow-user="onFollowChange" />
		</b-col>
		<b-col class="bg-light" cols="7">
			<t-tweet-create-form v-if="isCurrentUser" @success="loadTweets" />
			<template v-if="tweets.length">
				<t-tweet v-for="tweet in tweets" :key="tweet._id" :tweet="tweet" />
			</template>
			<template v-else>
				<p class="mt-5 mb-5 text-muted text-center">There are no tweets yet 👻</p>
			</template>
		</b-col>
	</b-row>
</template>

<script>
	import TProfile from '@/components/profile.vue';
	import TTweetCreateForm from '@/components/tweetForm.vue';
	import TTweet from '@/components/tweet.vue';

	export default {
		components: {
			TProfile,
			TTweetCreateForm,
			TTweet
		},
		async middleware({ store, params }) {
			await store.dispatch('getUserTweets', {
				username: params.username
			});
			if (store.state.auth.user.username !== params.username) {
				await store.dispatch('getUser', {
					username: params.username
				});
			}
		},
		computed: {
			isCurrentUser() {
				return this.$store.state.auth.user.username === this.$route.params.username;
			},
			tweets() {
				return this.$store.state.userTweets;
			},
			user() {
				return this.isCurrentUser ? this.$store.state.auth.user : this.$store.state.user;
			}
		},
		methods: {
			loadTweets() {
				return this.$store.dispatch('getUserTweets', {
					username: this.$store.state.auth.user.username
				});
			},
			onFollowChange(username) {
				return this.$store.dispatch('getUser', {
					username
				});
			}
		}
	};
</script>
