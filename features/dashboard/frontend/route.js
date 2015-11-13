/**
 * Created by thangnv on 11/12/15.
 */
'use strict'
module.exports = function (component,app) {
    let comp = component.controllers.frontend;
    return {
        "/" : {
            get : {
                handler : comp.view
            }
        }
    }
}