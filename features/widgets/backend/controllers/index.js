'use strict';

module.exports = function (controller, component, application) {
    let mockWidgetName = 'categories';

    controller.index = function (req, res) {
        // Get all widgets
        console.log("\x1b[33m", application.widgetManager.getAttribute(), "\x1b[0m");

    };

    controller.createWidget = function (req, res) {
        // Mockup render widget setting form
        let html = application
            .widgetManager
            .getComponent(mockWidgetName)
            .controllers
            .settingWidget(mockWidgetName);

        res.render('new', {
            html: html
        })
    };

    controller.saveWidget = function (req, res) {
        // Mockup save user settings
        res.send(application.widgetManager.getComponent(mockWidgetName).controllers.saveWidget());
    };
};