'use strict';

module.exports = function (component, app) {

    let controller = component.controllers.backend;

    return {
        "/widgets": {
            get: {
                handler: controller.index,
                authenticate : true,
                permissions : "index"
            }
        },
        "/widgets/add/:widgetName([a-zA-Z0-9_-]+)": {
            get: {
                handler: controller.addWidget,
                authenticate : true,
                permissions : "index"
            }
        },
        "/widgets/save": {
            post: {
                handler: controller.saveWidget,
                authenticate : true,
                permissions : "index"
            }
        },
        "/widgets/sort": {
            post: {
                handler: controller.sortWidget,
                authenticate : true,
                permissions : "index"
            }
        },
        "/widgets/delete": {
            post: {
                handler: controller.deleteWidget,
                authenticate : true,
                permissions : "index"
            }
        }
    }
};