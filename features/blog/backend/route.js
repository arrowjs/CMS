'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component, application) {
    return {
        "post": {
            get: {
                handler: component.controllers.backend.index
            }
        }
    }
};