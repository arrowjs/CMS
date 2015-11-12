'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component, application) {
    return {
        "/blog": {
            get: {
                handler: component.controllers.frontend.index
            }
        }
    }
};