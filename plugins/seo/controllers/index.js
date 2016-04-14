"use strict";

var formidable = require("formidable");

module.exports = function (controller, component, app) {

    controller.saveSeo = function (req, res, next) {
        let data = {};
        let key = '';
        new formidable.IncomingForm().parse(req)
            .on('field', function (name, field) {
                if (name === "key") {
                    key = field
                } else {
                    data[name] = field;
                }
            })
            .on('error', function (err) {
                next(err);
            })
            .on('end', function () {
                if (key) {
                    data.page_title = data.page_title.trim();
                    data.meta_keywords = data.meta_keywords.trim();
                    data.meta_description = data.meta_description.trim()
                        .replace(/\n/g, '').replace(/\r/g, '').replace(/"/g, '\'');
                    component.actions.saveData(key, JSON.stringify(data))
                } else {
                    res.end();
                }
            });
    };
};