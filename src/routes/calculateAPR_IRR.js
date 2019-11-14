'use strict';

const express = require('express');
const calculateAPR_IRR = new express.Router();
const {irr} = require('node-irr');
const {log} = require('../logger');

const getInitialPayload = ({body}) => {
    const {principal: principalAmount, upfrontFee, schedule} = body;
    return {principalAmount, upfrontFee, schedule};
};

const getComputedCashInflow = ({principalAmount, upfrontFee, schedule}) => {
    const cashInflow = schedule.reduce((acc, {principal: _principal, interestFee}) =>
        acc + ((_principal + interestFee)), upfrontFee.value);

    return {cashInflow, principalAmount, schedule}
};

const cashInFlowByPrincipal = ({cashInflow, principalAmount, schedule}) => {
    return {
        cashInFlowByPrincipal: (cashInflow / principalAmount),
        months: schedule.length,
        cashInflow,
        principalAmount
    }
};

const getNumberOfDaysInLoan = ({cashInFlowByPrincipal, months, cashInflow, principalAmount}) => {
    return {
        daysToComputeDailyCostOfBorrowing: Math.ceil((months / 12) * 365),
        cashInFlowByPrincipal,
        cashInflow,
        principalAmount
    }
};

const dailyCostOfBorrowing = ({cashInFlowByPrincipal, daysToComputeDailyCostOfBorrowing: days, cashInflow, principalAmount}) => {
    return {
        borrowedDailyCost: (cashInFlowByPrincipal / days),
        cashInflow,
        principalAmount
    }
};

const getAnnualizedRate = ({borrowedDailyCost, cashInflow, principalAmount}) => {
    return {
        annualizedRate: (borrowedDailyCost * 365),
        cashInflow,
        principalAmount
    }
};

const getAPR = ({annualizedRate, cashInflow, principalAmount}) => {
    return {
        apr: (annualizedRate * 100),
        cashInflow,
        principalAmount
    }
};

const getIRR = ({apr, cashInflow, principalAmount}) => {
    return {
        apr,
        irr: irr(([-Math.abs(principalAmount), cashInflow]))
    }
};

const getAPR_IRR = ({apr, irr}) => {
    return {
        apr: Number(apr.toFixed(2)),
        irr: Number(irr.toFixed(10))
    }
};

const pipe = (...fns) => (request) => fns.reduce((acc, fn) => {
    return fn(acc);
}, request);


calculateAPR_IRR.post('/', (request, response) => {
    try {
        const result = pipe(
            getInitialPayload,
            getComputedCashInflow,
            cashInFlowByPrincipal,
            getNumberOfDaysInLoan,
            dailyCostOfBorrowing,
            getAnnualizedRate,
            getAPR,
            getIRR,
            getAPR_IRR
        )(request);

        log.info(`Request sent with ${JSON.stringify(request.body)}`);

        response.json(result);
    } catch (error) {
        log.error(`${error.stack}`);
        throw error;
    }

});

module.exports = calculateAPR_IRR;
