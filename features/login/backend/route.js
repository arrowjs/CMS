/**
 * Created by thangnv on 11/11/15.
 */
'use strict';

module.exports = function (component,app) {
    let comp = component.controllers.backend;
    return {
        "/login" : {
            get : {
                handler : comp.view
            },
            post : {
                authenticate : 'local_login'
            }
        },
        "/logout" : {
            get : {
                handler : comp.logout
            }
        },
        "/403" : {
            get : {
                handler : comp.notPermission,
                authenticate : true
            }
        }
    }
}