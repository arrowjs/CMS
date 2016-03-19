'use strict';

module.exports = function (component, app) {

    let controller = component.controllers.backend;

    return {
        "/": {
            get: {
                handler: controller.view,
                authenticate: true
            }
        }
    }
};