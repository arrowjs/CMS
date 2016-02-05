'use strict';

module.exports = {
    handler: function (link, item) {
        let myRegex = /{(.*?)}/g;
        let match = myRegex.exec(link);

        while (match != null) {
            link = link.replace(/{(.*?)}/g, function (x) {
                if (x.indexOf('.') > -1) {
                    x = x.replace(/[{}]/g, "");
                    let arr = x.split('.');
                    let value = '';
                    for (let i in arr) {
                        item = (item[arr[i]] != null) ? item[arr[i]] : '';
                        value = item;
                    }
                    return value;
                } else {
                    return item[x.replace(/[{}]/g, "")];
                }
            });
            match = myRegex.exec(link);
        }

        return link;
    }
};