const express = require('express'),
	compression = require('compression'),
	cookieParser = require('cookie-parser');

const config = require('./config'),
	nuxtConfig = require('../nuxt.config');

const connectDatabase = require('./utils/connectDatabase'),
	createNuxtApplication = require('./utils/createNuxtApplication');

const apiRouter = require('./routers/api');

(async () => {

	// Connect Mongo database
	await connectDatabase(config.mongoUri);

	// Create Nuxt application
	let nuxt = await createNuxtApplication(nuxtConfig, config);

	// Create Express application
	let app = express();

	// Use compression middleware
	app.use(compression());

	// Use static path middleware
	app.use(express.static(config.staticPath));

	// Use cookie parser middleware
	app.use(cookieParser());

	// Use JSON parser middleware
	app.use(express.json());

	// Use API router
	app.use('/api', apiRouter);

	// Use Nuxt middleware
	app.use(nuxt.render);

	// Create HTTP server
	app.listen(config.port);

})();
