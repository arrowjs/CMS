'use strict';

let arrowFunction = require('arrowjs').globalFunction;
let path = require('path');
let _ = Arrow._;

module.exports = function (controller, component, application) {
    controller.theme_index = function (req, res) {
        let themes = [];

        arrowFunction.getGlobbedFiles(__base + 'themes/frontend/*/theme.json').forEach(function (filePath) {
            let data = require(filePath);
            data.folder = path.basename(path.dirname(filePath));
            themes.push(data);
        });

        let current_theme = application.getConfig("frontendTheme");
        themes.map(function (theme_info) {
            if (_.isString(current_theme) && theme_info.folder.toLowerCase() === current_theme.toLowerCase()) {
                current_theme = theme_info;
            }
        });

        res.render('themes/index', {
            themes: themes,
            current_theme: current_theme,
            title: __('m_configurations_backend_themes_render_title')
        });
    };
    controller.theme_detail = function (req, res) {
        //res.locals.backButton = __acl.addButton(req, route, 'change_themes', '/admin/configurations/themes');

        let themes = [];

        arrowFunction.getGlobbedFiles(__base + 'themes/frontend/*/theme.json').forEach(function (filePath) {
            let data = require(filePath);
            data.folder = path.basename(path.dirname(filePath));
            themes.push(data);
        });

        let current_theme = application.getConfig("frontendTheme");
        themes.map(function (theme_info) {
            if (_.isString(current_theme) && theme_info.folder.toLowerCase() === current_theme.toLowerCase()) {
                current_theme = theme_info;
            }
        });

        res.render('themes/detail', {
            current_theme: current_theme,
            title: __('m_configurations_backend_themes_render_detail')
        });
    };
    controller.theme_change = function (req, res) {
        let theme = req.params.themeName;
        application.setConfig("frontendTheme", theme).then(function () {
            req.flash.success(__('m_configurations_backend_themes_change_message_success'));
            res.sendStatus(200);
        })
    };
};

