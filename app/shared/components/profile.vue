<template>
	<div v-if="user" class="pt-3 pb-3 sticky-top">
		<b-card class="d-flex text-center">
			<b-avatar class="mb-2" :text="user.firstName[0] + user.lastName[0]" size="lg" />
			<div><strong class="text-body">{{ user.fullName }}</strong></div>
			<div>
				<n-link :to="{ name: 'u-username', params: { username: user.username } }">
					<span class="text-muted">@{{ user.username }}</span>
				</n-link>
			</div>
			<template v-if="isCurrentUser">
				<hr />
				<b-button size="sm" variant="outline-danger" @click.prevent="logout">
					<b-icon-door-open />
				</b-button>
				<b-button size="sm" variant="light">
					<b-icon-bell /> Notifications
				</b-button>
			</template>
		</b-card>
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
</template>

<script>
	export default {
		props: {
			isCurrentUser: {
				type: Boolean,
				default: false
			},
			user: {
				type: Object,
				required: true
			}
		},
		methods: {
			async logout() {
				await this.$auth.logout();
				this.$router.push({
					name: 'login'
				});
			}
		}
	};
</script>
