<template>
	<b-card title="Login">
		<t-login-form @success="onSuccess" />
	</b-card>
</template>

<script>
	import TLoginForm from '@/components/loginForm.vue';

	export default {
		auth: false,
		components: {
			TLoginForm
		},
		methods: {
			onSuccess() {
				this.$router.push({
					name: 'index'
				});
			}
		},
		head: () => ({
			title: 'Login'
		})
	};
</script>
