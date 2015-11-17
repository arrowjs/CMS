"use strict";

module.exports ={
    handler : function (pk, item) {
        let myRegex = /{(.*?)}/g;
        let match = myRegex.exec(pk);

        while (match != null) {
            pk = pk.replace(/{(.*?)}/g, function (x) {
                if (x.indexOf('.') > -1) {
                    x = x.replace(/[{}]/g, "");
                    let arr = x.split('.');
                    let value = '';

                    for (let i in arr) {
                        if (arr.hasOwnProperty(i)) {
                            item = (item[arr[i]] != null) ? item[arr[i]] : '';
                            value = item;
                        }
                    }

                    return value;
                } else {
                    return item[x.replace(/[{}]/g, "")];
                }
            });
            match = myRegex.exec(pk);
        }
        return pk;
    }
}
