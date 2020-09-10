<template>
	<b-container class="h-100">
		<b-row align-h="end" class="h-100">
			<b-col v-if="showSidebar" cols="3">
				<div class="pt-3 pb-3 sticky-top">
					<b-button v-if="!isHomepage" block class="mb-1" size="sm" :to="{ name: 'index' }" variant="light">
						<b-icon-chevron-double-left /> Go to homepage
					</b-button>
					<t-profile v-if="user" :is-current-user="isCurrentUser" :user="user" @follow-user="onFollowChange" @unfollow-user="onFollowChange" />
					<p class="pt-1 text-center">
						<small>
							<a class="text-muted" href="https://github.com/vanekj" target="_blank">Author</a>
							&centerdot;
							<a class="text-muted" href="https://github.com/vanekj/twitter-clone" target="_blank">Repository</a>
							&centerdot;
							<a class="text-muted" href="https://github.com/vanekj/twitter-clone/issues" target="_blank">Report Issues</a>
						</small>
					</p>
				</div>
			</b-col>
			<b-col class="pt-3 pb-3 bg-light" :class="{ 'd-flex align-items-center': alignCenter }" cols="7">
				<nuxt />
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
	import TProfile from '@/components/profile.vue';

	export default {
		middleware: 'auth',
		components: {
			TProfile
		},
		computed: {
			alignCenter() {
				let routeNames = ['login', 'registration'];
				return routeNames.includes(this.$route.name);
			},
			showSidebar() {
				let routeNames = ['login', 'registration'];
				return !routeNames.includes(this.$route.name);
			},
			isCurrentUser() {
				let authUser = this.$store.state.auth.user,
					stateUser = this.$store.state.user;
				return this.isHomepage || stateUser && stateUser.username === authUser.username || authUser.username === this.$route.params.username;
			},
			isHomepage() {
				return this.$route.name === 'index';
			},
			user() {
				return this.isCurrentUser ? this.$store.state.auth.user : this.$store.state.user;
			}
		},
		methods: {
			async onFollowChange(username) {
				await Promise.all([
					this.$store.dispatch('getUser', {
						username
					}),
					this.$store.dispatch('getUserFollowers', {
						username
					}),
					this.$store.dispatch('getUserFollowing', {
						username
					})
				]);
			}
		}
	};
</script>

<style>
	html,
	body,
	#__nuxt,
	#__layout {
		height: 100%;
	}
</style>
