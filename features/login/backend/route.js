'use strict';

module.exports = function (component, app) {

    let controller = component.controllers.backend;

    return {
        "/login": {
            get: {
                handler: controller.view
            },
            post: {
                authenticate: 'local_login'
            }
        },
        "/logout": {
            get: {
                handler: controller.logout
            }
        },
        "/403": {
            get: {
                handler: controller.notHavePermission,
                authenticate: true
            }
        }
    }
};