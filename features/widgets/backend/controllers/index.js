'use strict';

let Promise = require("bluebird");

let fs = require("fs");
let readFileAsync = Promise.promisify(fs.readFile);

let log = require('arrowjs').logger;

module.exports = function (controller, component, application) {
    let mockWidgetName = 'categories';

    controller.index = function (req, res) {
        let widgets = application.widgetManager.getAttribute();

        // Read file theme.json to get registered sidebars
        readFileAsync(__base + "themes/frontend/" + application.getConfig('frontendTheme') + "/theme.json", "utf8")
            .then(function (data) {
                let sidebars = JSON.parse(data).sidebars;
                let actions = [];

                // Get all widgets foreach sidebar
                sidebars.map(function (sidebar, index) {
                    sidebars[index].widgets = [];

                    // Find all widgets with sidebar name
                    let action = application.models.widget.findAll({
                        where: {
                            sidebar: sidebar.name
                        },
                        order: ['ordering'],
                        raw: true
                    }).then(function (widgets) {
                        if (widgets && widgets.length) {
                            let resolve = Promise.resolve();

                            // Get widget data foreach widget
                            widgets.map(function (widget_data) {
                                // Get widget by name
                                let widget = application.widget[widget_data.widget_name];

                                if (widget) {
                                    // Get settings of each widget
                                    resolve = resolve.then(function () {
                                        return widget.controllers.settingWidget(widget_data)
                                    }).then(function (widget_settings) {
                                        // Set widget value to sidebars
                                        sidebars[index].widgets.push({
                                            data: widget_data,
                                            setting: widget_settings
                                        });

                                        return null;
                                    }).catch(function (err) {
                                        log.error(err);
                                    });
                                }
                            });

                            // Return widget settings of the sidebar
                            return resolve;
                        }
                    });

                    actions.push(action);
                });

                Promise.all(actions).then(function () {
                    return res.render('sidebars', {
                        widgets: widgets,
                        sidebars: sidebars
                    });
                });
            }).catch(function (err) {
                req.flash.error('Cannot parse "theme.json" file');

                res.render('sidebars', {
                    widgets: widgets,
                    sidebars: null
                });
            });
    };

    controller.createWidget = function (req, res) {
        let widgetName = req.params.widgetName;
        let widget = application.widget[widgetName];

        if (widget) {
            res.send(widget.controllers.settingWidget({widget_name: widgetName, data: {}}));
        } else {
            res.send('');
        }
    };

    controller.saveWidget = function (req, res) {
        // Mockup save user settings
        res.send(application.widgetManager.getComponent(mockWidgetName).controllers.saveWidget());
    };
};