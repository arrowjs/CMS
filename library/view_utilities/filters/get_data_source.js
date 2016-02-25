"use strict";

module.exports = {
    async: true,
    handler: function (source, filter, cb) {
        if (typeof source == 'string') {
            if (filter.source_type && filter.source_type == "query") {
                this.models.rawQuery(source).then(function (data) {
                    data = data[0];
                    let arr = [];
                    for (let i in data) {
                        let ob = {};
                        ob[filter.display_key] = data[i][filter.display_key];
                        ob[filter.value_key] = data[i][filter.value_key];
                        arr.push(ob);
                    }
                    cb(null, arr);
                });
            } else if (filter.source_type == "static_resource") {
                this.models.rawQuery(source).then(function (data) {
                    cb(null, data[0][0].data);
                });
            } else {
                this.models[source].findAll({
                    attributes: [filter.display_key, filter.value_key]
                }).then(function (data) {
                    cb(null, data);
                });
            }
        } else {
            cb(null, source);
        }
    }
};
