'use strict';

let arrowFunction = require('arrowjs').globalFunction;
let path = require('path');

module.exports = function (controller, component, application) {
    controller.theme_index = function (req, res) {
        let themes = [];

        arrowFunction.getGlobbedFiles(__base + 'themes/frontend/*/theme.json').forEach(function (filePath) {
            let arrayName = path.dirname(filePath).split('/');
            let data = require(filePath);
            data.folder = arrayName[arrayName.length - 1];
            themes.push(data);
        });

        let current_theme = application.getConfig("frontendTheme");
        for (let i in themes) {
            if (themes.hasOwnProperty(i) && current_theme && themes[i].information.theme_name.toLowerCase === current_theme.toLowerCase) {
                current_theme = themes[i];
            }
        }

        res.render( 'themes/index', {
            themes: themes,
            current_theme: current_theme,
            title: __('m_configurations_backend_themes_render_title')
        });
    }
};

