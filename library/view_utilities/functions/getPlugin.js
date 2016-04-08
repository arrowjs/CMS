"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;
let Promise = require('arrowjs').Promise;

module.exports = {

    async: true,

    /**
     * Get plugin by key and location
     *
     * @param key - Key of plugin
     * @param location - Location of plugin
     * @param dynamicData - Dynamic data used in specific view
     * @param callback - Content of sidebar
     */
    handler: function (key, location, dynamicData, callback) {
        let app = this;
        if (key) {
            app.models.plugin.findAll({
                where: {
                    active: true
                },
                order: "ordering ASC",
                raw: true
            }).then(function (plugins) {
                let html = '';

                if (_.isEmpty(plugins)) {
                    callback(null, '');
                } else {
                    Promise.map(plugins, function (plugin) {
                        let pluginConfig = app.plugin[plugin.plugin_name];

                        if (pluginConfig.pluginLocation && pluginConfig.pluginLocation.hasOwnProperty(location)) {
                            return pluginConfig.actions.getData(key).then(function (data) {
                                if (data) {
                                    if (typeof data == 'string'){
                                        try {
                                            data = JSON.parse(data);
                                        } catch (e) {
                                            return null;
                                        }
                                    }

                                    if (_.isPlainObject(dynamicData)) {
                                        data = _.merge(data, dynamicData);
                                    }

                                    return pluginConfig.actions.render(data, pluginConfig.pluginLocation[location], dynamicData).then(function (pluginHtml) {
                                        html += pluginHtml;
                                        return null;
                                    });
                                } else {
                                    return null;
                                }
                            });
                        }
                    }).then(function () {
                        callback(null, html);
                    });
                }
            }).catch(function () {
                callback(null, '');
            });
        } else {
            callback(null, '');
        }
    }
};