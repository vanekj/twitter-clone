<template>
	<b-row class="h-100">
		<b-col></b-col>
		<b-col cols="7" class="d-flex align-items-center bg-light">
			<b-card title="Login">
				<t-login-form @success="onSuccess" />
			</b-card>
		</b-col>
	</b-row>
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
