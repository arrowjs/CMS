'use strict';

module.exports = function (component,application) {
    let comp = component.controllers.backend;
    return {
        "/users" : {
            get : {
                handler : comp.list,
                name : "users-get",
                authenticate : true,
                role : "index"
            },
            delete : {
                name : "users-delete",
                handler : comp.delete,
                authenticate : true,
                role : "delete"
            },
            param : { // bad logic param for all router users/...  here
                key : "uid",
                handler : comp.userById
            }
        },
        "change-pass" : {
            get : {
                handler : comp.changePass,
                name : "users-change-pass-get", //unique string, name route.
                authenticate : true, //boolean true false.
                role :  "update_profile"
            },
            post : {
                handler : comp.updatePass,
                name : "users-change-pass-post", //unique string, name route.
                authenticate : true, //boolean true false.
                role :  "update_profile"
            }
        },
        "profile/:uid([0-9]+)" : { //    admin/profile/:uid
            get : {
                handler : comp.profile,
                name : "users-profile-get", //unique string, name route.
                authenticate : true, //boolean true false.
                role :  "update_profile"
            },
            post : {
                handler : [comp.update,comp.profile],
                name : "users-profile-post", //unique string, name route.
                authenticate : true, //boolean true false.
                role :  ["update","update_profile"]
            }
        },

        "page/:page([0-9]+)" : {
            get : {
                handler : comp.list,
                name : "users-page",
                authenticate : true,
                role : "index"
            }
        },
        "page/:page([0-9]+)/sort/:sort/(:order)?" : {
            get : {
                handler : comp.list,
                name : "users-page-sort",
                authenticate : true,
                role : "index"
            }
        },
        "create" : {
            get : {
                handler : comp.create,
                name : "users-create-get",
                authenticate : true,
                role : "create"
            },
            post : {
                handler : [comp.save, comp.list],
                name : "users-create-post",
                authenticate : true,
                role : "create"
            }
        },
        "avatar" : {
            post : {
                handler : comp.getAvatarGallery,
                name : "users-avatar",
                authenticate : true,
                role : "update_profile"
            }
        }
    }


};

