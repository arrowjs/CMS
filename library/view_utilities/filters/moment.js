/**
 * Created by thangnv on 11/13/15.
 */
'use strict'

let moment = require('moment');

module.exports = {
    handler : function (input,format) {
        return moment(input).format(format);
    }
};