/* eslint-disable object-property-newline,object-curly-newline */
module.exports = {
	telemetry: false,
	mode: 'universal',
	head: {
		htmlAttrs: {
			lang: 'en'
		},
		titleTemplate(pageTitle) {
			let primaryTitle = 'Twitter Clone',
				secondaryTitle = pageTitle ? ` - ${pageTitle}` : '';
			return `${primaryTitle}${secondaryTitle}`;
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ name: 'description', content: 'Twitter Clone' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},
	modules: [
		'@nuxtjs/axios',
		'bootstrap-vue/nuxt'
	],
	plugins: [
		'@/plugins/axios'
	],
	srcDir: './app/shared'
};
