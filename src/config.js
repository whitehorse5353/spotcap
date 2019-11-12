const {
    HOST,
    PORT,
    APP_BASE_URL,
    CORS_ORIGIN,
    LOG_LEVEL,
    ENABLE_SWAGGER
} = process.env;

module.exports = {
    application: {
        host: HOST,
        port: PORT,
        baseURL: APP_BASE_URL
    },
    corsConfig: {
        origin: CORS_ORIGIN,
        methods: ['POST', 'GET']
    },
    cspConfig: {
        directives: {
            defaultSrc: ["'self'"]
        }
    },
    logLevel: LOG_LEVEL,
    hasSwagger: ENABLE_SWAGGER
};
