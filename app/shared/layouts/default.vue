<template>
	<b-container class="h-100" fluid>
		<nuxt />
	</b-container>
</template>

<script>
	export default {
		middleware: 'auth'
	};
</script>

<style>
	html,
	body,
	#__nuxt,
	#__layout {
		height: 100%;
	}
</style>
