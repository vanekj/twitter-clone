<template>
	<div>
		<h5>Followers</h5>
		<template v-if="userFollowers.length">
			<b-row>
				<b-col v-for="account in userFollowers" :key="account._id" cols="4">
					<t-profile :is-current-user="account.username === currentUser.username" is-followers-list :show-footer="false" :user="account" @follow-user="onFollowChange" @unfollow-user="onFollowChange" />
				</b-col>
			</b-row>
		</template>
		<template v-else>
			<p class="mt-5 mb-5 text-muted text-center">User has no followers 😕</p>
		</template>
	</div>
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
				store.dispatch('getUserFollowers', {
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
			userFollowers() {
				return this.$store.state.userFollowers;
			}
		},
		methods: {
			async onFollowChange() {
				await Promise.all([
					this.$store.dispatch('getUser', {
						username: this.user.username
					}),
					this.$store.dispatch('getUserFollowers', {
						username: this.user.username
					})
				]);
			}
		}
	};
</script>
