"use strict";
let _ = require('lodash');

module.exports = function (req,res,next) {
    res.addButton = function (buttons) {
        if(!_.isEmpty(buttons)){
            Object.keys(buttons).map(function (name) {
                let btn = {};
                if(_.isString(buttons[name])) {
                    btn.link = buttons[name];
                } else {
                    btn = buttons[name];
                }
                res.locals[name] = btn;
            })
        }
    };
    next()
}