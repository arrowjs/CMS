'use strict';

module.exports = function (component,application) {
    let comp = component.controllers.backend;
    return {
        "/menu" : {
            get : {
                handler : comp.index,
			authenticate: true,
                permissions: "index"
            },
            delete : {
                handler : comp.delete,
			authenticate: true,
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
			authenticate: true,
                permissions: "create"
            },
            post : {
                handler : comp.save,
			authenticate: true,
                permissions: "create"
            }
        },
        "/menu/update/:mid":{
            get : {
                handler : [comp.read],
			authenticate: true,
                permissions: "update"
            },
            post : {
                handler : comp.update,
			authenticate: true,
                permissions: "update"
            }
        },
        '/menu/sort-admin-menu' : {
            get : {
                handler : comp.sortAdminMenu,
			authenticate: true,
                permissions: "update"
            },
            post : {
                handler : comp.saveSortAdminMenu,
			authenticate: true,
                permissions: "update"
            }
        },
        '/menu/sort/:sort/:order': {
            get : {
                handler : comp.index,
			authenticate: true,
                permissions: "index"
            }
        }
    }
};
