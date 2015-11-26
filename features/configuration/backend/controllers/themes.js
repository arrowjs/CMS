'use strict';

let arrowFunction = require('arrowjs').globalFunction;
let path = require('path');
let logger = require('arrowjs').logger,
    _ = require('arrowjs')._,
    fs = require('arrowjs').fs,
    formidable = require('formidable'),
    admzip = require('adm-zip');

module.exports = function (controller, component, application) {

    controller.themeIndex = function (req, res) {
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
            title: 'Theme Configurations'
        });
    };

    controller.themeDetail = function (req, res) {
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
            title: 'Theme detail'
        });
    };

    controller.changeTheme = function (req, res) {
        let theme = req.params.themeName;

        application.setConfig("frontendTheme", theme).then(function () {
            req.flash.success('Theme was changed successfully');
            res.sendStatus(200);
        })
    };

    controller.importTheme = function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let file_name = files.zip_file.name;
            let tmp_path = files.zip_file.path;

            if (file_name.substr(file_name.lastIndexOf('.') + 1) != 'zip') {
                req.flash.error('Only zip file is allowed!');
                return res.redirect('/admin/configuration/themes');
            }

            // Use admzip to unzip uploaded file
            var zip = new admzip(tmp_path);
            var zipEntries = zip.getEntries();

            // Extract all inside files to themes/frontend/
            try {
                zipEntries.forEach(function (zipEntry) {
                    if (zipEntry.isDirectory == false) {
                        zip.extractEntryTo(zipEntry.entryName, __base + 'themes/frontend/');
                    }
                });

                // Remove __MACOSX folder if exists
                fs.removeSync(__base + 'themes/frontend/__MACOSX');

                req.flash.success('Import theme successfully');

            } catch (error) {
                req.flash.error(error);
            }

            res.redirect('/admin/configuration/themes');
        });
    };
};

