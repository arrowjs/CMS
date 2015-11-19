/**
 * Created by thangnv on 11/13/15.
 */
'use strict';

let moment = require('moment');

module.exports = {
    handler : function (input,format) {
        if (!format) {
            format = this.getConfig('date_format') || 'DD-MM-YYYY';
        }
        return moment(input).format(format);
    }
};