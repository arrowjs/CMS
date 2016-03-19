'use strict';

module.exports = function (component, app) {

    let controller = component.controllers.backend;

    return {
        "/configuration/site-info": {
            get: {
                handler: controller.index,
                authenticate: true,
                permissions: "update_info"
            },
            post: {
                handler: [controller.updateConfig, controller.index],
                authenticate: true,
                permissions: "update_info"
            }
        },
        "/configuration/themes": {
            get: {
                handler: controller.themeIndex,
                authenticate: true,
                permissions: "change_theme"
            }
        },
        "/configuration/import-theme": {
            post: {
                handler: controller.importTheme,
                permissions: "import_theme"
            }
        },
        "/configuration/themes/:themeName": {
            get: {
                handler: controller.themeDetail,
                authenticate: true,
                permissions: "change_theme"
            },
            post: {
                handler: controller.changeTheme,
                authenticate: true,
                permissions: "change_theme"
            }
        }
    }
};