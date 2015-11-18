"use strict";
let _ = require('lodash');

module.exports = function (req,res,next) {
    res.addButton = function (buttons) {
        if(!_.isEmpty(buttons)){
            Object.keys(buttons).map(function (name) {
                let btn = {};
                if(_.isString(buttons[name])) {
                    res.locals[name] = buttons[name];
                } else {
                    res.locals[name] = true;
                    res.locals.btn = buttons[name];
                }
            })
        }
    };
    next()
}