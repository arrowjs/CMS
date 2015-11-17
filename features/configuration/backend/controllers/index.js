"use strict";
let _ = require('lodash');

module.exports = function (controller,component,application) {
    controller.index =  function (req, res) {
        res.render( 'sites/index', {
            config: application._config,
            lang: application._lang,
            title: __('m_configurations_backend_index_render_title')
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
//_module.update_setting = function (req, res, next) {
//    let data = req.body;
//
//    // Site info
//    __config.app.title = data.title;
//    __config.app.description = data.description;
//    __config.app.logo = data.logo;
//    __config.app.icon = data.icon;
//    __config.app.language = data.language;
//    __config.pagination.number_item = data.number_item;
//
//    // Database info
//    __config.db.host = data.db_host;
//    __config.db.port = data.db_port;
//    __config.db.username = data.db_username;
//
//    if (data.db_password != '') {
//        __config.db.password = data.db_password;
//    }
//
//    __config.db.dialect = data.db_dialect;
//
//    if (data.logging) {
//        __config.db.logging = true;
//    }
//
//    // Redis info
//    __config.redis.host = data.redis_host;
//    __config.redis.port = data.redis_port;
//    redis.set(__config.redis_prefix + __config.key, JSON.stringify(__config), function (err,k) {
//        configManager.reloadConfig().then(function (k) {
//            moduleManager.loadAllModules().then(function () {
//                req.flash.success(__.t('m_configurations_backend_index_flash_update_setting_success'));
//            });
//            next();
//        })
//    });
//};

