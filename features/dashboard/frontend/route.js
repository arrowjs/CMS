'use strict';

module.exports = function (component) {
    let controller = component.controllers.frontend;

    return {
        "/": {
            get: {
                handler: controller.index
            }
        },
        "/change-theme/:theme([0-9a-zA-Z-]+)": {
            get: {
                handler: controller.changeTheme
            }
        }
    }
};