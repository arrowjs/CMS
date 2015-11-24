"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;

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

                widgets.map(function (widgetData) {
                    // Get widget by type
                    let widget = app.widgetManager.getComponent(widgetData.widget_name);

                    if (widget) {
                        // Get content of each widget in the sidebar
                        resolve = resolve.then(function () {
                            return widget.controllers.renderWidget(widgetData)
                        }).then(function (view) {
                            return html += view;
                        }).catch(function (err) {
                            log.error(err);
                        });
                    }
                });

                // Return content of the sidebar
                resolve.then(function () {
                    callback(null, html);
                });
            } else {
                callback(null, '');
            }
        }).catch(function (err) {
            log.error(err);
        });
    }
};