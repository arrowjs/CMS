"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;

module.exports = {

    async: true,

    handler: function (pluginName, pluginConfig, callback) {
        let app = this;
        app.plugin[pluginName].render("setting", {plugin: pluginConfig}).then(function (html) {
            callback(null, html);
        });
    }
};