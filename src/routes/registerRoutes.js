const express = require('express');
const router = new express.Router();
const {application} = require('../config');
const healthCheck = require('./healthCheck');
const calculateAPR_IRR = require('./calculateAPR_IRR');
module.exports = (app) => {
    app.use('/health-check', healthCheck);
    app.use('/calculate-apr-irr', calculateAPR_IRR);
};
