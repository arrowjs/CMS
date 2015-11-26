'use strict';

module.exports = function (component) {
    let controller = component.controllers.frontend;

    return {
        "/": {
            get: {
                handler: controller.index
            }
        }
    }
};