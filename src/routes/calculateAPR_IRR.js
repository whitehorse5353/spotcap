'use strict';

const express = require('express');
const calculateAPR_IRR = new express.Router();
const {irr} = require('node-irr');

calculateAPR_IRR.post('/', (request, response) => {
    const {body} = request;
    const {principal, upfrontFee, schedule} = body;
    const cashInflow = schedule.reduce((acc, {principal, interestFee}) => acc + (principal), upfrontFee.value);

    response.json({
        apr: null,
        irr: irr(([-Math.abs(principal), cashInflow]))
    })
});

module.exports = calculateAPR_IRR;
