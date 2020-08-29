<template>
	<div class="pt-3">
		<b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
		<b-form @submit.prevent="onSubmit">
			<b-row>
				<b-col cols="6">
					<b-form-group label="Nickname">
						<b-form-input v-model="form.nickname" required />
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group label="Password">
						<b-form-input v-model="form.password" type="password" required />
					</b-form-group>
				</b-col>
				<b-col class="pt-3">
					<b-button type="submit" variant="primary" :disabled="working">
						<b-spinner v-if="working" type="grow" small />
						Login
					</b-button>
					<b-button variant="link" :to="{ name: 'registration' }">
						Create an account
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
					nickname: '',
					password: ''
				}
			};
		},
		methods: {
			onSubmit() {
				this.working = true;
				this.$axios.post('/api/auth/login', {
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
