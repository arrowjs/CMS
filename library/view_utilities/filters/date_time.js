'use strict';

module.exports = {
    handler: function (input) {
        if (input != '') {
            let func = env.getFilter('date');
            return func(input, this.getConfig('dateFormat'));
        } else {
            return '';
        }
    }
};