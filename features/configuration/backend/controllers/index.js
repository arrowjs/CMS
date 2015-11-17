"use strict";
let _ = require('lodash');

module.exports = function (controller, component, application) {
    controller.index = function (req, res) {
        res.render('sites/index', {
            config: application._config,
            lang: application._lang,
            title: __('m_configurations_backend_index_render_title')
        });
    };
    controller.update_config = function (req, res, next) {
        let data = req.body;
        let config = {};
        //
        // Site info
        config.app = {};
        config.app.title = data.title;
        config.app.description = data.description;
        config.app.language = data.language;
        config.language = data.language;
        //config.pagination.number_item = data.number_item || 0;

        application.updateConfig(config).then(function (config) {
            req.flash.success(__('m_configurations_backend_index_flash_update_setting_success'));
            next();
        }).catch(function (err) {
            console.log(err)
        });
    };
};


//let redis = require('redis').createClient();
//
//let _module = new BackModule;
//var configManager = require('arrowjs/configManager');
//var moduleManager = require('arrowjs/moduleManager');
//
//_module.
//
//_module.update_setting =
