'use strict';

module.exports = function (component, app) {

    let controller = component.controllers.backend;

    return {
        "/menu": {
            get: {
                handler: controller.index,
                authenticate: true,
                permissions: "index"
            },
            delete: {
                handler: controller.delete,
                authenticate: true,
                permissions: "delete"
            },
            param: {
                key: "mid",
                handler: controller.menuById
            }
        },
        "/menu/create": {
            get: {
                handler: controller.create,
                authenticate: true,
                permissions: "create"
            },
            post: {
                handler: controller.save,
                authenticate: true,
                permissions: "create"
            }
        },
        "/menu/update/:mid": {
            get: {
                handler: controller.read,
                authenticate: true,
                permissions: "update"
            },
            post: {
                handler: controller.update,
                authenticate: true,
                permissions: "update"
            }
        },
        '/menu/sort-admin-menu': {
            get: {
                handler: controller.sortAdminMenu,
                authenticate: true,
                permissions: "update"
            },
            post: {
                handler: controller.saveSortAdminMenu,
                authenticate: true,
                permissions: "update"
            }
        },
        '/menu/sort/:sort/:order': {
            get: {
                handler: controller.index,
                authenticate: true,
                permissions: "index"
            }
        }
    }
};
