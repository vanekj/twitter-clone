<template>
	<b-row class="h-100">
		<b-col />
		<b-col cols="3">
			<t-profile is-current-user :user="user" />
		</b-col>
		<b-col class="bg-light" cols="7">
			<t-tweet-create-form @success="loadTweets" />
			<template v-if="tweets.length">
				<t-tweet v-for="tweet in tweets" :key="tweet._id" :tweet="tweet" />
			</template>
			<template v-else>
				<p class="mt-5 mb-5 text-muted text-center">No tweets were found 🤪</p>
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
		async middleware({ store }) {
			await store.dispatch('getTweets');
		},
		computed: {
			tweets() {
				return this.$store.state.tweets;
			},
			user() {
				return this.$store.state.auth.user;
			}
		},
		methods: {
			loadTweets() {
				return this.$store.dispatch('getTweets');
			}
		}
	};
</script>
