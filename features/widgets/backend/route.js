'use strict';

/**
 * Widgets routes
 */
module.exports = function (component, application) {
    return {
        "/widgets": {
            get: {
                handler: component.controllers.backend.index,
                authenticate : true,
                permissions : "index"
            }
        },
        "/widgets/add/:widgetName([a-zA-Z0-9_-]+)": {
            get: {
                handler: component.controllers.backend.addWidget,
                authenticate : true,
                permissions : "index"
            }
        },
        "/widgets/save": {
            post: {
                handler: component.controllers.backend.saveWidget,
                authenticate : true,
                permissions : "index"
            }
        },
        "/widgets/sort": {
            post: {
                handler: component.controllers.backend.sortWidget,
                authenticate : true,
                permissions : "index"
            }
        },
        "/widgets/delete": {
            post: {
                handler: component.controllers.backend.deleteWidget,
                authenticate : true,
                permissions : "index"
            }
        }
    }
};