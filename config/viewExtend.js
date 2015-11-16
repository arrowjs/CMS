"use strict";

let globalFunction = require('arrowjs').globalFunction;
let path = require('path');

module.exports = {
    getWidgetLayouts: function(widget_name){
        let viewExtension = this.getConfig('viewExtension');
        let viewPath = this.widgetManager.getComponent(widget_name).views;

        // Get layout files from widget directory
        return globalFunction.getGlobbedFiles(viewPath + '*.' + viewExtension).map(function (link) {
            return path.basename(link, '.' + viewExtension);
        });
    }
};