'use strict';

module.exports = function (controller, component, application) {
    let mockWidgetName = 'categories';

    controller.index = function (req, res) {
        // Get all widgets
        component.models.widget.findAll().then(function (widgets) {
            res.render('index', {
                widgets: widgets
            })
        });
    };

    controller.createWidget = function (req, res) {
        // Mockup render widget setting form
        res.send(application
            .widgetManager
            .getComponent(mockWidgetName)
            .controllers
            .createWidget(mockWidgetName));

    };

    controller.saveWidget = function (req, res) {
        // Mockup save user settings
        res.send(application.widgetManager.getComponent(mockWidgetName).controllers.saveWidget());
    };
};