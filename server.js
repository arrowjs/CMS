'use strict';
const Arrow = require('arrowjs');
const application = new Arrow();

let addButton = require("./middleware/addButton");

application.afterAuthenticate(addButton);

application.start({
    passport :false,
    role : false
});