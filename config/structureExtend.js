'use strict';

let globalFunction = require('arrowjs').globalFunction;
let path = require('path');
let _ = require('arrowjs')._;

module.exports = {

    /**
     * Get all layouts of widget by name
     *
     * @param widget_name - Name of widget
     * @returns {array} - List of widget layouts
     */
    getWidgetLayouts: function (widget_name) {
        let viewExtension = this.getConfig('viewExtension');
        let views = this.widgetManager.getComponent(widget_name).views;

        // Get layout files from widgets directory
        let basePath = views[1].fatherBase + '/' + views[1].func(this.getConfig(), widget_name);
        let baseFiles = globalFunction.getGlobbedFiles(basePath + '*.' + viewExtension).map(function (link) {
            return path.basename(link, '.' + viewExtension);
        });

        // Get layout files from themes directory
        let themePath = path.normalize(__base + views[0].func(this.getConfig(), widget_name));
        let themeFiles = globalFunction.getGlobbedFiles(themePath + '*.' + viewExtension).map(function (link) {
            return path.basename(link, '.' + viewExtension);
        });

        return _.union(baseFiles, themeFiles);
    }
};