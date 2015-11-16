"use strict";

let globalFunction = require('arrowjs').globalFunction;
let path = require('path');
let _ = require('lodash');

module.exports = {
    getWidgetLayouts: function(widget_name){
        let viewExtension = this.getConfig('viewExtension');
        let viewPath = this.widgetManager.getComponent(widget_name).views;


console.log("\x1b[32m", viewPath[0].func(this.getConfig(),widget_name), viewPath[1].func(this.getConfig(),widget_name), "\x1b[0m");
        // Get layout files from widget directory
        //let files= globalFunction.getGlobbedFiles(viewPath + '*.' + viewExtension).map(function (link) {
        //    return path.basename(link, '.' + viewExtension);
        //});

        return 'sdfsdf';
    }
};