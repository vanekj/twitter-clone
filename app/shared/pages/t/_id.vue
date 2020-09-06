<template>
	<b-row class="h-100">
		<b-col />
		<b-col cols="3">
			<t-profile />
		</b-col>
		<b-col class="bg-light" cols="7">
			<t-tweet :tweet="tweet" show-comments @delete="onTweetDelete" />
		</b-col>
	</b-row>
</template>

<script>
	import TProfile from '@/components/profile.vue';
	import TTweet from '@/components/tweet.vue';

	export default {
		components: {
			TProfile,
			TTweet
		},
		async middleware({ store, params }) {
			await store.dispatch('getTweet', {
				tweetId: params.id
			});
		},
		computed: {
			tweet() {
				return this.$store.getters.getSingleTweet(this.$route.params.id);
			}
		},
		methods: {
			onTweetDelete() {
				this.$router.push({
					name: 'index'
				});
			}
		}
	};
</script>
