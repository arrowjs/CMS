'use strict';

module.exports = function (component,application) {
    return {
        "/configuration/site-info" : {
            get : {
                handler : component.controllers.backend.index,
                authenticate : true,
                permissions : "update_info"
            },
            post : {
                handler : [component.controllers.backend.update_config,component.controllers.backend.index],
                authenticate : true,
                permissions : "update_info"
            }
        },
        "/configuration/themes" : {
            get : {
                handler : component.controllers.backend.theme_index,
                authenticate : true,
                permissions : "change_themes"
            }
            //delete : {
            //    handler : component.controllers.backend.theme_delete,
            //    permissions : "delete_themes"
            //}
        },
        //"/configuration/import" : {
        //    get : {
        //        handler : component.controllers.backend.theme_import,
        //        permissions : "import_themes"
        //    }
        //}
        "/configuration/themes/:themeName" : {
            get : {
                handler : component.controllers.backend.theme_detail,
                authenticate : true,
                permissions : "change_themes"
            },
            post : {
                handler : component.controllers.backend.theme_change,
                authenticate : true,
                permissions : "change_themes"
            }
        }
    }
};