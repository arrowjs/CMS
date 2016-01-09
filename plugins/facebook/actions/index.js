"use strict";

module.exports = function (action, component, app) {

    action.getData = function (key) {
        return app.models.plugin.find({
            where: {
                plugin_name: 'facebook'
            }
        }).then(function (result) {
            if (key != 'facebook')
                return null;
            else
                return result.data;
        }).catch(function (err) {
            return null;
        });
    };

    action.render = function (data, view) {
        return component.render(view, data).then(function (html) {
            return html;
        });
    };
};