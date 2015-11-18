/**
 * Created by thangnv on 11/12/15.
 */
'use strict';
/*
* route :if /roles => /[admin_prefix]/roles
*        else roles =>/[admin_prefix]/roles(name of modules)/roles
* */
module.exports = function (component,app) {
    let comp = component.controllers.backend;
    return {
        "/roles" : {
            get : {
                handler : comp.list,
                authenticate : true,
                permissions : "view"
            },
            delete : {
                handler : comp.delete,
                authenticate : true,
                permissions : "delete"
            }

        },
        "/roles/sort/:sort/:order" : {
            get : {
                handler : comp.list,
                authenticate : true,
                permissions : "view"
            }

        },
        "create" : {
            get : {
                handler : comp.create,
                authenticate : true,
                permissions : "create"
            },
            post : {
                handler : [comp.save,comp.list],
                authenticate : true,
                permissions : "create"
            }

        },
        "/roles/:rid" : {
            get : {
                handler : comp.view,
                authenticate : true,
                permissions : "update"
            },
            post : {
                handler : [comp.update,comp.list],
                authenticate : true,
                permissions : "update"
            }

        }
    }
}