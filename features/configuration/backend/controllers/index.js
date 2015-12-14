'use strict';

let lang = require('arrowjs').language.languageKey;
let logger = require('arrowjs').logger;

module.exports = function (controller, component, application) {

    controller.index = function (req, res) {
        // Add toolbar
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addSaveButton(ArrowHelper.isAllow(req, 'update_info'));

        res.render('sites/index', {
            config: application.getConfig(),
            lang: lang(),
            title: __('m_configurations_backend_index_render_title'),
            toolbar: toolbar.render()
        });
    };

    controller.updateConfig = function (req, res, next) {
        let data = req.body;
        let config = {};

        // Site info
        config.app = {};
        config.app.title = data.title;
        config.app.description = data.description;
        config.language = data.language || application.getConfig('language');
        config.pagination = {};
        config.pagination.numberItem = data.number_item || 5;
        config.autoSaveDelay = (data.auto_save_delay > 0) ? data.auto_save_delay : 10;

        application.updateConfig(config).then(function () {
            req.flash.success(__('m_configurations_backend_index_flash_update_setting_success'));
            next();
        }).catch(function (err) {
            logger.error(err)
        });
    };
};

