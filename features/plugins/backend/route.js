'use strict';

module.exports = function (component, app) {

    let controller = component.controllers.backend;

    return {
        "/plugins": {
            get: {
                handler: controller.index,
                authenticate: true,
                permissions: "index"
            }
        },
        "/plugins/:pluginName": {
            get: {
                handler: controller.viewPlugin,
                authenticate: true,
                permissions: "index"
            },
            post: {
                handler: controller.updatePlugin,
                authenticate: true,
                permissions: "index"
            }
        },
        "/plugins/:pluginName/active": {
            get: {
                handler: controller.activePlugin,
                authenticate: true,
                permissions: "index"
            }
        }
    }
};