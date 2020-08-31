<template>
	<div class="mt-3 mb-5">
		<b-alert variant="danger" :show="!!error">{{ error }}</b-alert>
		<b-form @submit.prevent="onSubmit">
			<b-row>
				<b-col cols="12">
					<b-form-textarea v-model="form.content" placeholder="Write down your message..." rows="2" required />
				</b-col>
				<b-col class="pt-1 text-right">
					<b-button size="sm" type="submit" variant="primary" :disabled="working">
						<b-spinner v-if="working" type="grow" small />
						Post comment
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
		props: {
			tweetId: {
				type: String,
				required: true
			}
		},
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
				this.$store.dispatch('addTweetComment', {
					tweetId: this.tweetId,
					commentData: this.form
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
