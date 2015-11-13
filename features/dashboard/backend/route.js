/**
 * Created by thangnv on 11/11/15.
 */
'use strict';

module.exports = function (component, app) {
    let comp = component.controllers.backend;
    return {
        "/": {
            get: {
                handler: comp.view,
                authenticate: true
            }
        }
    }
};