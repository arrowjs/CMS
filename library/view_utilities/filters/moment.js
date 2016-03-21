'use strict';

let moment = require('moment');

module.exports = {
    handler: function (input, format) {
        if (!format) {
            format = this.getConfig('dateFormat') || 'DD-MM-YYYY';
        }
        return moment(input).format(format);
    }
};