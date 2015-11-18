'use strict';

/**
 * Widgets routes
 */
module.exports = function (component, application) {
    return {
        "/widgets": {
            get: {
                handler: component.controllers.backend.index
            }
        },
        "/widgets/add/:widgetName([a-zA-Z0-9_-]+)": {
            get: {
                handler: component.controllers.backend.addWidget
            }
        },
        "/widgets/save": {
            post: {
                handler: component.controllers.backend.saveWidget
            }
        },
        "/widgets/sort": {
            post: {
                handler: component.controllers.backend.sortWidget
            }
        },
        "/widgets/delete": {
            post: {
                handler: component.controllers.backend.deleteWidget
            }
        }
    }
};