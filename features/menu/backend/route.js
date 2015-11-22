'use strict';

module.exports = function (component,application) {
    let comp = component.controllers.backend;
    return {
        "/menu" : {
            get : {
                handler : comp.index,
                permissions: "index"
            },
            delete : {
                handler : comp.delete,
                permissions : "delete"
            },
            param : {
                key : "mid",
                handler : comp.menuById
            }
        },
        "/menu/create" : {
            get : {
                handler : comp.create,
                permissions: "create"
            },
            post : {
                handler : comp.save,
                permissions: "create"
            }
        },
        "/menu/update/:mid":{
            get : {
                handler : [comp.read],
                permissions: "update"
            },
            post : {
                handler : comp.update,
                permissions: "update"
            }
        },
        '/menu/sort-admin-menu' : {
            get : {
                handler : comp.sortAdminMenu,
                permissions: "update"
            },
            post : {
                handler : comp.saveSortAdminMenu,
                permissions: "update"
            }
        },
        '/menu/sort/:sort/:order': {
            get : {
                handler : comp.index,
                permissions: "index"
            }
        }
    }
};
