'use strict';

module.exports = function (controller, component, application) {
    let mockWidgetID = 'categories';

    controller.index = function (req, res) {
        res.send('widget module');
    };

    controller.createWidget = function (req, res) {
        // Mockup render widget setting form
        res.send(application.widgetManager._widget[mockWidgetID].controllers.createWidget());
    };

    controller.saveWidget = function (req, res) {
        // Mockup save user settings
        res.send(application.widgetManager._widget[mockWidgetID].controllers.saveWidget());
    };
};