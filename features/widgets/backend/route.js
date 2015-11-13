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
        "/widgets/create": {
            get: {
                handler: component.controllers.backend.createWidget
            }
        },
        "/widgets/save": {
            get: {
                handler: component.controllers.backend.saveWidget
            }
        }
    }
};