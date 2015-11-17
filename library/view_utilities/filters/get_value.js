/**
 * Created by thangnv on 11/16/15.
 */
'use strict';

module.exports =  {
    handler : function (input, item) {
        if (~input.indexOf('.')) {
            let arr = input.split('.');
            let value = '';
            for (let i in arr) {
                item = (item[arr[i]] != null) ? item[arr[i]] : '';
                value = item;
            }
            return value;
        } else {
            if (item != null && item[input] != null) {
                return item[input];
            } else {
                return '';
            }
        }
    }
};