'use strict';

module.exports = function (component,application) {
    return {
        "/menu" : {
            get : {
                handler : component.controllers.backend.index,
                permissions: "index"
            },
            delete : {
                handler : component.controllers.backend.delete,
                permissions : "delete"
            },
            param : {
                key : "menu_id",
                handler : component.controllers.backend.menuById
            }
        },
        "/menu/create" : {
            get : {
                handler : component.controllers.backend.create,
                permissions: "create"
            },
            post : {
                handler : component.controllers.backend.save,
                permissions: "save"
            }
        },
        "/menu/update/:menu_id":{
            get : {
                handler : component.controllers.backend.read,
                permissions: "update"
            },
            post : {
                handler : component.controllers.backend.update,
                permissions: "update"
            }
        },
        '/menu/sort-admin-menu' : {
            get : {
                handler : component.controllers.backend.sortAdminMenu,
                permissions: "update"
            },
            post : {
                handler : component.controllers.backend.saveSortAdminMenu,
                permissions: "update"
            }
        },
        '/menu/sort/:sort/:order': {
            get : {
                handler : component.controllers.backend.index,
                permissions: "index"
            }
        }
    }
};
