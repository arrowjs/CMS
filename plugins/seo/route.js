"use strict";

module.exports = function (comp, app) {
    return {
        "/admin/plugins/seo/save": {
            post: {
                handler: comp.controllers.saveSeo
            }
        }
    }
};