<template>
	<div class="mb-5">
		<b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
		<b-form @submit.prevent="onSubmit">
			<b-row>
				<b-col cols="12">
					<b-form-textarea v-model="form.content" placeholder="Jot something down..." rows="3" required />
				</b-col>
				<b-col class="pt-1 text-right">
					<b-button type="submit" variant="primary" :disabled="working">
						<b-spinner v-if="working" type="grow" small />
						Post tweet
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
	const initialFormData = {
		content: ''
	};

	export default {
		data() {
			return {
				error: '',
				working: false,
				form: {
					...initialFormData
				}
			};
		},
		methods: {
			onSubmit() {
				this.working = true;
				this.$store.dispatch('addTweet', {
					tweetData: this.form
				}).then(() => {
					this.$emit('success', this.form);
				}).catch((error) => {
					this.error = error.response.data.message;
				}).finally(() => {
					this.form = {
						...initialFormData
					};
					this.working = false;
				});
			}
		}
	};
</script>
