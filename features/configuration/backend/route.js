'use strict';

module.exports = function (component, application) {
    return {
        "/configuration/site-info": {
            get: {
                handler: component.controllers.backend.index,
                authenticate: true,
                permissions: "update_info"
            },
            post: {
                handler: [component.controllers.backend.updateConfig, component.controllers.backend.index],
                authenticate: true,
                permissions: "update_info"
            }
        },
        "/configuration/themes": {
            get: {
                handler: component.controllers.backend.themeIndex,
                authenticate: true,
                permissions: "change_theme"
            }
            //delete : {
            //    handler : component.controllers.backend.theme_delete,
            //    permissions : "delete_themes"
            //}
        },
        "/configuration/import-theme" : {
            post : {
                handler : component.controllers.backend.importTheme,
                permissions : "import_theme"
            }
        },
        "/configuration/themes/:themeName": {
            get: {
                handler: component.controllers.backend.themeDetail,
                authenticate: true,
                permissions: "change_theme"
            },
            post: {
                handler: component.controllers.backend.changeTheme,
                authenticate: true,
                permissions: "change_theme"
            }
        }
    }
};