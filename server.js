'use strict';

const Arrow = require('arrowjs');
const application = new Arrow();

application.start({
    passport: true,
    role: true
});