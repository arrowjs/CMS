"use strict";

var formidable = require("formidable");

module.exports = function (controller, comp, app) {

    controller.saveSeo = function (req, res, next) {
        let data = {};
        let key = "";
        new formidable.IncomingForm().parse(req)
            .on('field', function (name, field) {
                if (name === "key") {
                    key = field
                } else {
                    data[name] = field
                }
            })
            .on('error', function (err) {
                next(err);
            })
            .on('end', function () {
                if (key) {
                    comp.actions.saveData(key, JSON.stringify(data))
                } else {
                    res.end();
                }
            });
    };
};