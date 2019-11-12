'use strict';

require('dotenv').config();
const {application, corsConfig, cspConfig, hasSwagger, logLevel} = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');


app.use(bodyParser.json());
app.use(helmet());
// app.use(helmet.contentSecurityPolicy(cspConfig));
app.use(helmet.noCache());
app.use(cors(corsConfig));

require('./routes/registerRoutes')(app);

app.listen(application.port, () => console.log(`Listening on port ${application.host}:${application.port}`));

module.exports = app;
