<template>
	<b-card title="Registration">
		<t-registration-form @success="onSuccess" />
	</b-card>
</template>

<script>
	import TRegistrationForm from '@/components/registrationForm.vue';

	export default {
		auth: false,
		components: {
			TRegistrationForm
		},
		methods: {
			onSuccess() {
				this.$router.push({
					name: 'login'
				});
			}
		},
		head: () => ({
			title: 'Registration'
		})
	};
</script>
