'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component) {
    let controller = component.controllers.frontend;

    return {
        "/blog": {
            get: {
                handler: controller.allPosts
            }
        }
    }
};