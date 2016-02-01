'use strict';

module.exports = {
    handler: function (value, defaultValue) {
        if (value) {
            return value;
        } else {
            return defaultValue;
        }
    }
};
