'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component, application) {
    return {
        "/": {
            get: {
                handler: component.controllers.frontend.index
            }
        },
        "/change-theme/:theme([0-9a-zA-Z-]+)": {
            get: {
                handler: component.controllers.frontend.changeTheme
            }
        }
    }
};