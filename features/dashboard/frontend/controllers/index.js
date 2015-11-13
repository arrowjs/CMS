'use strict';

module.exports = function (controller, component, application) {
    let mockWidgetID = 'categories';

    controller.index = function (req, res) {
        res.frontend.render('index', {
            widget: application.widgetManager._widget[mockWidgetID].controllers.renderWidget()
        })
    };

    controller.changeTheme = function (req, res) {
        let theme = req.params.theme || "acme";

        application.setConfig("frontendTheme", theme).then(function () {
            res.redirect('/');
        });
    };
};