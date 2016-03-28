'use strict';

module.exports = function (component, app) {

    let controller = component.controllers.backend;

    return {
        "/users": {
            get: {
                handler: controller.list,
                name: "users-get",
                authenticate: true,
                permissions: "index"
            },
            delete: {
                name: "users-delete",
                handler: controller.delete,
                authenticate: true,
                permissions: "delete"
            },
            param: {
                key: "uid",
                handler: controller.userById
            }
        },
        "/users/page/:page": {
            get: {
                handler: controller.list,
                authenticate: true,
                permissions: 'index'
            }
        },
        "/users/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.list,
                authenticate: true,
                permissions: 'index'
            }
        },
        "/users/:uid([0-9]+)": {
            get: {
                handler: controller.view,
                name: "update-users-get",
                authenticate: true,
                permissions: 'index'
            },
            post: {
                handler: [controller.update, controller.view],
                name: "update-users-post",
                authenticate: true,
                permissions: 'update'
            }
        },
        "change-pass": {
            get: {
                handler: controller.changePass,
                name: "users-change-pass-get",
                authenticate: true
            },
            post: {
                handler: controller.updatePass,
                name: "users-change-pass-post",
                authenticate: true
            }
        },
        "profile": {
            get: {
                handler: controller.profile,
                name: "users-profile-get",
                authenticate: true
            },
            post: {
                handler: [controller.updateProfile, controller.profile],
                name: "users-profile-post",
                authenticate: true
            }
        },
        "/users/:page([0-9]+)": {
            get: {
                handler: controller.list,
                name: "users-page",
                authenticate: true,
                permissions: "index"
            }
        },
        "/users/:page([0-9]+)/:sort/(:order)?": {
            get: {
                handler: controller.list,
                name: "users-page-sort",
                authenticate: true,
                permissions: "index"
            }
        },
        "create": {
            get: {
                handler: controller.create,
                name: "users-create-get",
                authenticate: true,
                permissions: "create"
            },
            post: {
                handler: [controller.save, controller.create],
                name: "users-create-post",
                authenticate: true,
                permissions: "create"
            }
        },
        "avatar": {
            post: {
                handler: controller.getAvatarGallery,
                name: "users-avatar",
                authenticate: true
            }
        }
    }

};

