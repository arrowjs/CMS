'use strict';

module.exports = function (component,application) {
    let comp = component.controllers.backend;
    return {
        "/users" : {
            get : {
                handler : comp.list,
                name : "users-get",
                authenticate : true,
                permissions : "index"
            },
            delete : {
                name : "users-delete",
                handler : comp.delete,
                authenticate : true,
                permissions : "delete"
            },
            param : { // bad logic param for all router users/...  here
                key : "uid",
                handler : comp.userById
            }
        },
        "/users/:uid([0-9]+)" : {
            get : {
                handler : comp.view,
                name : "update-users-get",
                authenticate : true,
                permissions : "index"
            },
            post : {
                handler : [comp.update,comp.view],
                name : "update-users-post",
                authenticate : true,
                permissions : 'update'
            }
        },
        "change-pass" : {
            get : {
                handler : comp.changePass,
                name : "users-change-pass-get", //unique string, name route.
                authenticate : true, //boolean true false.
                permissions :  "update_profile"
            },
            post : {
                handler : comp.updatePass,
                name : "users-change-pass-post", //unique string, name route.
                authenticate : true, //boolean true false.
                permissions :  "update_profile"
            }
        },
        "profile/:uid([0-9]+)" : { //    admin/profile/:uid
            get : {
                handler : comp.profile,
                name : "users-profile-get", //unique string, name route.
                authenticate : true, //boolean true false.
                permissions :  "update_profile"
            },
            post : {
                handler : [comp.update,comp.profile],
                name : "users-profile-post", //unique string, name route.
                authenticate : true, //boolean true false.
                permissions :  "update_profile"
            }
        },

        "/users/:page([0-9]+)" : {
            get : {
                handler : comp.list,
                name : "users-page",
                authenticate : true,
                permissions : "index"
            }
        },
        "/users/:page([0-9]+)/:sort/(:order)?" : {
            get : {
                handler : comp.list,
                name : "users-page-sort",
                authenticate : true,
                permissions : "index"
            }
        },
        "create" : {
            get : {
                handler : comp.create,
                name : "users-create-get",
                authenticate : true,
                permissions : "create"
            },
            post : {
                handler : [comp.save, comp.list],
                name : "users-create-post",
                authenticate : true,
                permissions : "create"
            }
        },
        '/forgot-password' : {
            get : {
                handler : comp.forgotPassView,
                name : "forgot-password"
            },
            post : {
                handler : comp.forgotPass
            }
        },
        "avatar" : {
            post : {
                handler : comp.getAvatarGallery,
                name : "users-avatar",
                authenticate : true,
                permissions : "update_profile"
            }
        }
    }


};

