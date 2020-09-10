<template>
	<div>
		<t-tweet-create-form v-if="isCurrentUser" @success="loadTweets" />
		<template v-if="tweets.length">
			<t-tweet v-for="tweet in tweets" :key="tweet._id" :tweet="tweet" />
		</template>
		<template v-else>
			<p class="mt-5 mb-5 text-muted text-center">There are no tweets yet 👻</p>
		</template>
	</div>
</template>

<script>
	import TTweetCreateForm from '@/components/tweetForm.vue';
	import TTweet from '@/components/tweet.vue';

	export default {
		components: {
			TTweetCreateForm,
			TTweet
		},
		async middleware({ store, params }) {
			await Promise.all([
				store.dispatch('getUser', {
					username: params.username
				}),
				store.dispatch('getUserTweets', {
					username: params.username
				})
			]);
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
			async loadTweets() {
				await this.$store.dispatch('getUserTweets', {
					username: this.$store.state.auth.user.username
				});
			}
		}
	};
</script>
