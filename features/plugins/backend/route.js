'use strict';

/**
 * Widgets routes
 */
module.exports = function (component, application) {
    return {
        "/plugins": {
            get: {
                handler: component.controllers.backend.index,
                authenticate : true,
                permissions : "index"
            }
        },
        "/plugins/:pluginName": {
            get: {
                handler: component.controllers.backend.viewPlugin,
                authenticate : true,
                permissions : "index"
            },
            post : {
                handler: component.controllers.backend.updatePlugin,
                authenticate : true,
                permissions : "index"
            }
        },
        "/plugins/:pluginName/active": {
            get: {
                handler: component.controllers.backend.activePlugin,
                authenticate : true,
                permissions : "index"
            }
        }

    }
};