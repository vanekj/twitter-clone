<template>
	<b-row class="h-100">
		<b-col />
		<b-col cols="3">
			<t-profile />
		</b-col>
		<b-col class="bg-light" cols="7">
			<t-tweet-create-form v-if="isCurrentUser" @success="loadTweets" />
			<t-tweet v-for="tweet in tweets" :key="tweet._id" :tweet="tweet" />
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
		},
		computed: {
			tweets() {
				return this.$store.state.tweets;
			},
			isCurrentUser() {
				return this.$store.state.auth.user.username === this.$route.params.username;
			}
		},
		methods: {
			loadTweets() {
				return this.$store.dispatch('getUserTweets', {
					username: this.$store.state.auth.user.username
				});
			}
		}
	};
</script>
