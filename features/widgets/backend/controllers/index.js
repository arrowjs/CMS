'use strict';

let _ = require('arrowjs')._;
let Promise = require('arrowjs').Promise;

let fs = require("fs");
let readFileAsync = Promise.promisify(fs.readFile);

let log = require('arrowjs').logger;

module.exports = function (controller, component, application) {

    let widgetModel = application.models.widget;

    /**
     * Manage sidebars page
     */
    controller.index = function (req, res) {
        // Read widget lists in widget directory and convert to array
        let widgets = _.values(application.widgetManager.getAttribute());

        // Read file theme.json to get registered sidebars
        readFileAsync(__base + "themes/frontend/" + application.getConfig('frontendTheme') + "/theme.json", "utf8")
            .then(function (data) {
                let sidebars = JSON.parse(data).sidebars;
                let actions = [];

                // Get all widgets foreach sidebar
                sidebars.map(function (sidebar, index) {
                    sidebars[index].widgets = [];

                    // Find all widgets with sidebar name
                    let action = widgetModel.findAll({
                        where: {
                            sidebar: sidebar.name
                        },
                        order: ['ordering'],
                        raw: true
                    }).then(function (widgets) {
                        if (widgets && widgets.length) {
                            let resolve = Promise.resolve();

                            // Get widget data foreach widget
                            widgets.map(function (widgetData) {
                                // Get widget by name
                                let widget = application.widget[widgetData.widget_name];

                                if (widget) {
                                    // Get settings of each widget
                                    resolve = resolve.then(function () {
                                        return widget.controllers.settingWidget(widgetData)
                                    }).then(function (widgetSettings) {
                                        // Set widget value to sidebars
                                        widgetData.widget_title = application.widgetManager.getComponent(widgetData.widget_name).title;
                                        sidebars[index].widgets.push({
                                            data: widgetData,
                                            setting: widgetSettings
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

                // Promise all actions
                Promise.all(actions).then(function () {
                    return res.render('sidebars', {
                        widgets: widgets,
                        sidebars: sidebars,
                        title: 'Widgets Manager'
                    });
                });
            }).catch(function (err) {
            req.flash.error('Cannot parse "theme.json" file');

            res.render('sidebars', {
                widgets: widgets,
                sidebars: null,
                title: 'Widgets Manager'
            });
        });
    };

    /**
     * Add widget to sidebar
     */
    controller.addWidget = function (req, res) {
        let widgetName = req.params.widgetName;
        let widget = application.widget[widgetName];

        if (widget) {
            // Get widget setting form
            widget.controllers.settingWidget({
                widget_name: widgetName,
                data: '{}'
            }).then(function (html) {
                res.send(html);
            });
        } else {
            res.send('');
        }
    };

    /**
     * Save widget
     */
    controller.saveWidget = function (req, res) {
        // Optimize post data

        let data = Object.assign({}, req.body);

        let mainAttributes = ['id', 'widget_name', 'sidebar', 'ordering'];
        let optionAttributes = {};
        for (let i in data) {
            if (data.hasOwnProperty(i) && mainAttributes.indexOf(i) == -1) {
                optionAttributes[i] = data[i];
                delete data[i];
            }
        }
        data.data = JSON.stringify(optionAttributes);

        // Save widget depend on data.id
        if (data.id && parseInt(data.id) && parseInt(data.id) > 0) {
            // Update widget
            widgetModel.findById(data.id).then(function (widget) {
                return widget.updateAttributes(data);
            }).then(function (widget) {
                // Return string ID
                res.send(widget.dataValues.id + '');
            }).catch(function (error) {
                res.send(error);
            })
        } else {
            delete data.id;

            // Create new widget
            widgetModel.create(data).then(function (widget) {
                // Return string ID
                res.send(widget.dataValues.id + '');
            }).catch(function (error) {
                res.send(error);
            })
        }
    };

    /**
     * Sort widgets in sidebar
     */
    controller.sortWidget = function (req, res) {
        let ids = req.body.ids.split(',');
        let sidebar = req.body.sidebar;
        let index = 1;
        let promises = [];

        for (let i in ids) {
            if (ids[i] == '') {
                index++;
                continue;
            }

            promises.push(
                // Update sidebar, ordering of widget
                application.models.rawQuery("UPDATE " + widgetModel.getTableName() + " SET ordering=?, sidebar=? WHERE id=?", {
                    replacements: [index++, sidebar, ids[i]]
                })
            );
        }

        Promise.all(promises).then(function (result) {
            res.sendStatus(200);
        }).catch(function (err) {
            res.sendStatus(500);
        });
    };

    /**
     * Delete widget from sidebar
     */
    controller.deleteWidget = function (req, res) {
        // Delete widget by id
        widgetModel.destroy({
            where: {
                id: req.body.id
            }
        }).then(function (count) {
            // Return number of deleted records (string)
            res.send(count + '');
        }).catch(function (err) {
            res.send(err);
        });
    }

};