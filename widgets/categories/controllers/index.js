'use strict';

let Promise = require('bluebird');

module.exports = function (controller, component, application) {

    controller.createWidget = function () {

    };

    controller.saveWidget = function () {

    };

    controller.renderWidget = function (widget) {
        let renderWidget = Promise.promisify(component.render);

        // Mockup render widget with default layout
        return renderWidget('default', {
            widget: widget
        })
    };
};

