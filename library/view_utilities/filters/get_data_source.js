"use strict";

module.exports =  {
    async : true,
    handler :  function (source, filter, cb) {
        console.log(filter + ' -- ' + source);
        //if (typeof source == 'string') {
        //    if (filter.source_type && filter.source_type == "query") {
        //        this.models.sequelize.query(source).then(function (data) {
        //            let arr = [];
        //            for (let i in data[0]) {
        //                let ob = {};
        //                ob[filter.display_key] = data[0][i][filter.display_key];
        //                ob[filter.value_key] = data[0][i][filter.value_key];
        //                arr.push(ob);
        //            }
        //            cb(null, arr);
        //        });
        //    } else {
        //        this.models.sequelize.query("select " + filter.display_key + ", " + filter.value_key + " from " + source).then(function (data) {
        //            cb(null, data[0]);
        //        });
        //    }
        //
        //} else {
        //    cb(null, source);
        //}
    }
};
