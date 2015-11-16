/**
 * Created by thangnv on 11/16/15.
 */
'use strict';
module.exports = {
    handler : function (value) {
        let c = 0,
            d = '.',
            t = ',';
        let n = value;
            c = isNaN(c = Math.abs(c)) ? 2 : c;
            d = (d == undefined) ? "," : d;
            t = (t == undefined) ? "." : t;
        let s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j;
        j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }
};