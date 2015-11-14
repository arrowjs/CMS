'use strict';
let Promise = require('bluebird');
module.exports = function (controller, component, application) {

    controller.createWidget = function () {
        // mockup
        return "<h1>New widget:</h1>" +
            "<label>Title</label>" +
            "<input type='text'/>";
    };

    controller.saveWidget = function () {
        // mockup
        console.log("\x1b[33m", 'Save widget to database', "\x1b[0m");
        return "<h1><em>success</em></h1>";
    };

    controller.renderWidget = function (widget) {
        let renderWidget = Promise.promisify(component.render);
        return renderWidget('default')

        //    return new Promise(function(fullfil, reject){
        //    return component.render('default', function(err, html){
        //        if(err) reject(err)
        //        else{
        //            fullfil(html);
        //        }
        //    })
        //})

    };
};

