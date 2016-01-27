'use strict';

module.exports = function (component, app) {
    
    let controller = component.controllers.backend;
    
    return {
        "/roles": {
            get: {
                handler: controller.list,
                authenticate: true,
                permissions: "view"
            },
            delete: {
                handler: controller.delete,
                authenticate: true,
                permissions: "delete"
            }

        },
        "/roles/sort/:sort/:order": {
            get: {
                handler: controller.list,
                authenticate: true,
                permissions: "view"
            }
        },
        "create": {
            get: {
                handler: controller.create,
                authenticate: true,
                permissions: "create"
            },
            post: {
                handler: [controller.save, controller.create],
                authenticate: true,
                permissions: "create"
            }
        },
        "/roles/:rid": {
            get: {
                handler: controller.view,
                authenticate: true,
                permissions: "update"
            },
            post: {
                handler: [controller.update, controller.view],
                authenticate: true,
                permissions: "update"
            }
        }
    }
    
};