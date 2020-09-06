<template>
	<div v-if="tweet">
		<b-overlay :show="tweetIsDeleting" spinner-type="grow" spinner-variant="danger" spinner-small>
			<b-card class="mt-3 mb-3">
				<div class="d-flex">
					<div class="pr-3">
						<b-avatar :text="tweet.author.firstName[0] + tweet.author.lastName[0]" />
					</div>
					<div class="flex-grow-1">
						<div class="d-flex align-items-center mb-2">
							<n-link class="mr-3" :to="{ name: 'u-username', params: { username: tweet.author.username } }">
								<strong class="text-body">{{ tweet.author.fullName }}</strong>
								<span class="text-muted">@{{ tweet.author.username }}</span>
							</n-link>
							<n-link v-b-tooltip.hover.bottom class="text-body" :title="tweet.createdAt | date()" :to="{ name: 't-id', params: { id: tweet._id } }">
								<small>
									{{ tweet.createdAt | date('simple') }}
								</small>
							</n-link>
							<b-dropdown v-if="userIsAuthor" class="ml-auto" size="sm" variant="light" no-caret right>
								<template v-slot:button-content>
									<b-icon-three-dots-vertical />
								</template>
								<b-dropdown-item-button @click.prevent="deleteTweet">
									<span class="text-danger">Delete</span>
								</b-dropdown-item-button>
							</b-dropdown>
						</div>
						<div class="mb-3" v-html="tweet.content"></div>
						<b-button size="sm" variant="light" @click.prevent="likeButtonClicked">
							<b-icon class="mr-1" :class="{ 'text-danger': isLiked }" :icon="isLiked ? 'heart-fill' : 'heart'" /> {{ tweet.likesCount }}
						</b-button>
						<b-button size="sm" variant="light" :to="{ name: 't-id', params: { id: tweet._id } }">
							<b-icon-chat class="mr-1" /> {{ tweet.commentsCount }}
						</b-button>
					</div>
				</div>
			</b-card>
		</b-overlay>
		<div v-if="showComments" class="ml-5">
			<t-tweet-comment v-for="comment in tweet.comments" :key="comment._id" :comment="comment" :tweet-id="tweet._id" />
			<t-tweet-comment-form :tweet-id="tweet._id" />
		</div>
	</div>
</template>

<script>
	import TTweetComment from '@/components/tweetComment.vue';
	import TTweetCommentForm from '@/components/tweetCommentForm.vue';

	export default {
		components: {
			TTweetComment,
			TTweetCommentForm
		},
		props: {
			tweet: {
				type: Object,
				default: () => null
			},
			showComments: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				tweetIsDeleting: false
			};
		},
		computed: {
			userIsAuthor() {
				let currentUserId = this.$store.state.auth.user.id;
				return this.tweet.author._id === currentUserId;
			},
			isLiked() {
				let currentUserId = this.$store.state.auth.user.id;
				return this.tweet.likes.some((like) => like.author._id === currentUserId);
			}
		},
		methods: {
			async likeButtonClicked() {
				await this.$store.dispatch(this.isLiked ? 'deleteTweetLike' : 'addTweetLike', {
					tweetId: this.tweet._id
				});
			},
			async deleteTweet() {
				try {
					this.tweetIsDeleting = true;
					await this.$store.dispatch('deleteTweet', {
						tweetId: this.tweet._id
					});
					this.$emit('delete');
				} catch {
					this.tweetIsDeleting = false;
				}
			}
		}
	};
</script>
