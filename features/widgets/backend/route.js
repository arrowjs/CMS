'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component, application) {
    return {
        "/widgets": {
            get: {
                handler: component.controllers.backend.index
            }
        },
        "/widgets/create/:widgetName([a-zA-Z0-9_-]+)": {
            get: {
                handler: component.controllers.backend.createWidget
            }
        }
    }
};