'use strict';

module.exports = function (component,application) {
    let comp = component.controllers.backend;
    return {
        "/users" : {
            get : {
                handler : comp.list,
                name : "users-get",
                authenticate : false,
                role : "index"
            },
            delete : {
                name : "users-delete",
                handler : comp.delete,
                authenticate : false,
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
                authenticate : false, //boolean true false.
                role :  "update_profile"
            },
            post : {
                handler : comp.updatePass,
                name : "users-change-pass-post", //unique string, name route.
                authenticate : false, //boolean true false.
                role :  "update_profile"
            }
        },
        "profile/:uid" : { //    admin/profile/:uid
            get : {
                handler : comp.profile,
                name : "users-profile-get", //unique string, name route.
                authenticate : false, //boolean true false.
                role :  "update_profile"
            },
            post : {
                handler : [comp.update,comp.profile],
                name : "users-profile-post", //unique string, name route.
                authenticate : false, //boolean true false.
                role :  ["update","update_profile"]
            }
        },

        "page/:page" : {
            get : {
                handler : comp.list,
                name : "users-page",
                authenticate : false,
                role : "index"
            }
        },
        "page/:page/sort/:sort/(:order)?" : {
            get : {
                handler : comp.list,
                name : "users-page-sort",
                authenticate : false,
                role : "index"
            }
        },
        "create" : {
            get : {
                handler : comp.create,
                name : "users-create-get",
                authenticate : false,
                role : "create"
            },
            post : {
                handler : [comp.save, comp.list],
                name : "users-create-post",
                authenticate : false,
                role : "create"
            }
        },
        "avatar" : {
            post : {
                handler : comp.getAvatarGallery,
                name : "users-avatar",
                authenticate : false,
                role : "update_profile"
            }
        }
        //":uid" : {
        //    get : {
        //        handler : comp.view,
        //        name : "users-update-get",
        //        authenticate : false,
        //        role : "update"
        //    },
        //    post : {
        //        handler : [comp.update,comp.list],
        //        name : "users-update-post",
        //        authenticate : false,
        //        role : "update"
        //    }
        //}
    }


};

