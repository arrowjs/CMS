"use strict";

module.exports = function (action, component, application) {
    action.resetBackendMenu = function () {
        return application.redisClient.delAsync(application.getConfig("redis_prefix") + application.getConfig("redis_key.backend_menus"))
    }
};