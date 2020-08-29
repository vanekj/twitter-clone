<template>
	<b-row class="h-100">
		<b-col></b-col>
		<b-col cols="5" class="d-flex align-items-center bg-light">
			<b-card title="Registration">
				<t-registration-form @success="onSuccess" />
			</b-card>
		</b-col>
	</b-row>
</template>

<script>
	import TRegistrationForm from '@/components/registrationForm.vue';

	export default {
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
