<template>
	<b-row class="h-100">
		<b-col />
		<b-col cols="3">
			<t-profile :is-current-user="isCurrentUser" :user="user" @follow-user="onFollowChange" @unfollow-user="onFollowChange" />
		</b-col>
		<b-col class="bg-light pt-3" cols="7">
			<h5>Following</h5>
			<template v-if="userFollowing.length">
				<b-row>
					<b-col v-for="account in userFollowing" :key="account._id" cols="4">
						<t-profile :is-current-user="account.username === currentUser.username" is-followers-list :show-footer="false" :user="account" @follow-user="onFollowChange" @unfollow-user="onFollowChange" />
					</b-col>
				</b-row>
			</template>
			<template v-else>
				<p class="mt-5 mb-5 text-muted text-center">User is not following any other users 😧</p>
			</template>
		</b-col>
	</b-row>
</template>

<script>
	import TProfile from '@/components/profile.vue';

	export default {
		components: {
			TProfile
		},
		async middleware({ store, params }) {
			await Promise.all([
				store.dispatch('getUser', {
					username: params.username
				}),
				store.dispatch('getUserFollowing', {
					username: params.username
				})
			]);
		},
		computed: {
			currentUser() {
				return this.$store.state.auth.user;
			},
			isCurrentUser() {
				return this.currentUser.username === this.$route.params.username;
			},
			user() {
				return this.isCurrentUser ? this.currentUser : this.$store.state.user;
			},
			userFollowing() {
				return this.$store.state.userFollowing;
			}
		},
		methods: {
			async onFollowChange() {
				await Promise.all([
					this.$store.dispatch('getUser', {
						username: this.user.username
					}),
					this.$store.dispatch('getUserFollowing', {
						username: this.user.username
					})
				]);
			}
		}
	};
</script>
