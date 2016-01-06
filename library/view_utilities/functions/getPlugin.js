"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;
let Promise = require("arrowjs").Promise;

module.exports = {

    async: true,

    /**
     * Get plugin by key and location
     *
     * @param key - Key of plugin
     * @param location - Location of plugin
     * @param callback - Content of sidebar
     */
    handler: function (key, location, callback) {
        let app = this;
        if (key) {
            app.models.plugin.findAll({
                where: {
                    active: true
                },
                order: "ordering asc",
                raw: true
            }).then(function (plugins) {
                let html = "";
                if (_.isEmpty(plugins)) {
                    callback(null, "")
                } else {
                    Promise.map(plugins, function (plugin) {
                        let pluginName = plugin.plugin_name;
                        if (app.plugin[pluginName] && app.plugin[pluginName].pluginLocation === location) {
                            return app.plugin[pluginName].actions.getData(key).then(function (data) {
                                if (data) {
                                    return app.plugin[pluginName].actions.render(data.value).then(function (pluginHtml) {
                                        html += pluginHtml;
                                        return null;
                                    });
                                } else {
                                    return null;
                                }
                            })
                        }
                    }).then(function () {
                        callback(null, html)
                    })
                }
            }).catch(function (err) {
                callback(null, "")
            })
        } else {
            callback(null, "")
        }
    }
};