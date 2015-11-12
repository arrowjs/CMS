"use strict";

module.exports = {
    redis_prefix: 'arrowjs_',
    redis_key : {
        configs : "site_setting",
        features : "all_features",
        backend_menus : "backend_menus",
        plugins : "all_plugins"
    },
    redis_event : {
        update_config : "config_update",
        update_feature : "feature_update"
    }
};