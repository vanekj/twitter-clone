<template>
	<div class="pt-3">
		<b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
		<b-form @submit.prevent="onSubmit">
			<b-row>
				<b-col cols="6">
					<b-form-group label="First name">
						<b-form-input v-model="form.firstName" required />
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group label="Last name">
						<b-form-input v-model="form.lastName" required />
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group label="Nickname">
						<b-form-input v-model="form.nickname" required />
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group label="Email">
						<b-form-input v-model="form.email" type="email" required />
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group label="Password">
						<b-form-input v-model="form.password" type="password" required />
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group label="Confirm password">
						<b-form-input v-model="form.confirmPassword" type="password" required />
					</b-form-group>
				</b-col>
				<b-col class="pt-3">
					<b-button type="submit" variant="primary" :disabled="working">
						<b-spinner v-if="working" type="grow" small />
						Register
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				error: '',
				working: false,
				form: {
					firstName: '',
					lastName: '',
					nickname: '',
					email: '',
					password: '',
					confirmPassword: ''
				}
			};
		},
		methods: {
			onSubmit() {
				this.working = true;
				this.$axios.post('/api/registration', {
					...this.form
				}).then(() => {
					this.$emit('success', this.form);
				}).catch((error) => {
					this.error = error.response.data.message;
				}).finally(() => {
					this.working = false;
				});
			}
		}
	};
</script>
