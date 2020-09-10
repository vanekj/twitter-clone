<template>
	<div v-if="user" class="pt-3 pb-3" :class="{ 'sticky-top': !isFollowersList, 'h-100': isFollowersList }">
		<b-card class="d-flex text-center" :class="{ 'h-100': isFollowersList }">
			<b-avatar class="mb-2" :text="user.firstName[0] + user.lastName[0]" size="lg" />
			<div><strong class="text-body">{{ user.fullName }}</strong></div>
			<div>
				<n-link :to="{ name: 'u-username', params: { username: user.username } }">
					<span class="text-muted">@{{ user.username }}</span>
				</n-link>
			</div>
			<b-button-group v-if="showFollows" class="mt-2 w-100" size="sm">
				<b-button :to="{ name: 'u-username-followers', params: { username: user.username } }" variant="light">
					<b-icon-arrow-down /> {{ user.followersCount }}
				</b-button>
				<b-button :to="{ name: 'u-username-following', params: { username: user.username } }" variant="light">
					<b-icon-arrow-up /> {{ user.followingCount }}
				</b-button>
			</b-button-group>
			<hr />
			<template v-if="isCurrentUser">
				<template v-if="isFollowersList">
					<small>That's you 😎</small>
				</template>
				<template v-else>
					<b-button size="sm" variant="outline-danger" @click.prevent="logout">
						<b-icon-door-open />
					</b-button>
					<b-button size="sm" variant="light">
						<b-icon-bell /> Notifications
					</b-button>
				</template>
			</template>
			<template v-else>
				<b-button v-if="following" size="sm" variant="light" @click="unfollowUser">
					<b-icon-check /> Following
				</b-button>
				<b-button v-else size="sm" variant="primary" @click="followUser">
					<b-icon-eye /> Follow
				</b-button>
			</template>
		</b-card>
		<p v-if="showFooter" class="pt-1 text-center">
			<small>
				<a class="text-muted" href="https://github.com/vanekj" target="_blank">Author</a>
				&centerdot;
				<a class="text-muted" href="https://github.com/vanekj/twitter-clone" target="_blank">Repository</a>
				&centerdot;
				<a class="text-muted" href="https://github.com/vanekj/twitter-clone/issues" target="_blank">Report Issues</a>
			</small>
		</p>
	</div>
</template>

<script>
	export default {
		props: {
			isCurrentUser: {
				type: Boolean,
				default: false
			},
			isFollowersList: {
				type: Boolean,
				default: false
			},
			user: {
				type: [Boolean, Object],
				required: true
			},
			showFooter: {
				type: Boolean,
				default: true
			},
			showFollows: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			following() {
				return this.$store.state.auth.user.following.includes(this.user._id);
			}
		},
		methods: {
			async followUser() {
				await this.$store.dispatch('followUser', {
					username: this.user.username
				});
				this.$emit('follow-user', this.user.username);
			},
			async unfollowUser() {
				await this.$store.dispatch('unfollowUser', {
					username: this.user.username
				});
				this.$emit('unfollow-user', this.user.username);
			},
			async logout() {
				await this.$auth.logout();
				this.$router.push({
					name: 'login'
				});
			}
		}
	};
</script>
