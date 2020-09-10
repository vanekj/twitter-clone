<template>
	<div>
		<t-tweet show-comments :tweet="tweet" @delete="onTweetDelete" />
	</div>
</template>

<script>
	import TTweet from '@/components/tweet.vue';

	export default {
		components: {
			TTweet
		},
		async middleware({ store, params }) {
			await store.dispatch('getTweet', {
				tweetId: params.id
			});
			let tweet = store.getters.getSingleTweet(params.id);
			await store.dispatch('getUser', {
				username: tweet.author.username
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
