"use strict";

let _ = require('lodash');

module.exports = {

    async: true,

    /**
     * Get sidebar by name
     *
     * @param sidebarName - Name of sidebar
     * @param callback - Content of sidebar
     */
    handler: function (sidebarName, callback) {
        let app = this;

        // Find all widgets in the sidebar
        app.models.widget.findAll({
            where: {
                sidebar: sidebarName
            },
            order: ['ordering'],
            raw: true
        }).then(function (widgets) {
            // Check the sidebar has widget
            if (widgets && widgets.length) {
                let html = '';
                let resolve = Promise.resolve();

                widgets.map(function (w) {
                    // Get widget by type
                    let widget = app.widgetManager._widget[w.widget_type];

                    if (widget) {
                        resolve = resolve.then(function () {
                            widget.controllers.renderWidget().then(function(html){
                                console.log("\x1b[32m", html, "\x1b[0m");
                            });
                        })
                    }
                });

                resolve.then(function () {
                    callback(null, html);
                });
            } else {
                callback(null, '');
            }
        });
    }
};