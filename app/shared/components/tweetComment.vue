<template>
	<b-overlay :show="commentIsDeleting" spinner-type="grow" spinner-variant="danger" spinner-small>
		<b-card class="mt-1 mb-1">
			<div class="d-flex align-items-center">
				<n-link class="mr-3" :to="{ name: 'u-username', params: { username: comment.author.username } }">
					<strong class="text-body">{{ comment.author.fullName }}</strong>
					<span class="text-muted">@{{ comment.author.username }}</span>
				</n-link>
				<small v-b-tooltip.hover.bottom class="text-body" :title="comment.createdAt | date()">
					{{ comment.createdAt | date('simple') }}
				</small>
				<b-dropdown v-if="userIsAuthor" class="ml-auto float-right" size="sm" variant="light" no-caret right>
					<template v-slot:button-content>
						<b-icon-three-dots-vertical />
					</template>
					<b-dropdown-item-button @click.prevent="deleteComment">
						<span class="text-danger">Delete</span>
					</b-dropdown-item-button>
				</b-dropdown>
			</div>
			<div v-html="comment.content"></div>
		</b-card>
	</b-overlay>
</template>

<script>
	export default {
		props: {
			comment: {
				type: Object,
				required: true
			},
			tweetId: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				commentIsDeleting: false
			};
		},
		computed: {
			userIsAuthor() {
				let currentUserId = this.$store.state.auth.user.id;
				return this.comment.author._id === currentUserId;
			}
		},
		methods: {
			async deleteComment() {
				try {
					this.commentIsDeleting = true;
					await this.$store.dispatch('deleteTweetComment', {
						tweetId: this.tweetId,
						commentId: this.comment._id
					});
				} catch {
					this.commentIsDeleting = false;
				}
			}
		}
	};
</script>
