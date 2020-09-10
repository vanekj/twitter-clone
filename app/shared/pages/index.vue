<template>
	<div>
		<t-tweet-create-form @success="loadTweets" />
		<template v-if="followingCount < 3">
			<h5>You can start following these accounts</h5>
			<b-row class="mb-5">
				<b-col v-for="randomUser in topUsers" :key="randomUser._id" cols="4">
					<t-profile :show-footer="false" :user="randomUser" @follow-user="onFollowChange" @unfollow-user="onFollowChange" />
				</b-col>
			</b-row>
		</template>
		<template v-if="tweets.length">
			<t-tweet v-for="tweet in tweets" :key="tweet._id" :tweet="tweet" />
		</template>
		<template v-else>
			<p class="mt-5 mb-5 text-muted text-center">No tweets were found 🤪</p>
		</template>
	</div>
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
			await Promise.all([
				store.dispatch('getTweets'),
				store.dispatch('getTopUsers')
			]);
		},
		computed: {
			followingCount() {
				return this.$store.state.auth.user.followingCount;
			},
			tweets() {
				return this.$store.state.tweets;
			},
			topUsers() {
				return this.$store.state.topUsers;
			}
		},
		methods: {
			async loadTweets() {
				await this.$store.dispatch('getTweets');
			},
			async onFollowChange() {
				await Promise.all([
					this.$store.dispatch('getTopUsers'),
					this.$store.dispatch('getTweets')
				]);
			}
		}
	};
</script>
