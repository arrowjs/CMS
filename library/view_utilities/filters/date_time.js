/**
 * Created by thangnv on 11/16/15.
 */
'use strict';

module.exports = {
    handler : function (input) {
        if (input != '') {
            let func = env.getFilter('date');
            return func(input, this.getConfig('date_format'));
        } else {
            return "";
        }
    }
}