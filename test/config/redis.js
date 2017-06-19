"use strict";

/**
 * Setting redis;
 * @type {{redis_prefix: string, redis_key: {configs: string, features: string, backend_menus: string, plugins: string}, redis_event: {update_config: string, update_feature: string}}}
 */
module.exports = {
    redis: {
        host: 'localhost',
        port: '6379',
        type : 'fakeredis'
    },
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