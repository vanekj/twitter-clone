/* eslint-disable object-property-newline,object-curly-newline */
module.exports = {
	telemetry: false,
	mode: 'universal',
	head: {
		htmlAttrs: {
			lang: 'en'
		},
		titleTemplate: 'Twitter Clone',
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
		'@nuxtjs/axios'
	],
	plugins: [
		'@/plugins/axios'
	],
	srcDir: './app/shared'
};
