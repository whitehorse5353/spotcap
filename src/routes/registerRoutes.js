const {log} = require('../logger');
const {hasSwagger} = require('../config');
const healthCheck = require('./healthCheck');
const calculateAPR_IRR = require('./calculateAPR_IRR');
const swagger = require('../../swagger/swagger');

module.exports = (app) => {

    log.info('Application routes registration started.');

    app.use('/health-check', healthCheck);
    app.use('/calculate-apr-irr', calculateAPR_IRR);

    log.info('Application routes registered successfully.');

    if (hasSwagger)
        app.use('/swagger', swagger);
};
