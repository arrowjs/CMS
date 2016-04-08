"use strict";

module.exports = function (action, component, app) {

    action.getData = function (key) {
        return app.models.seo.find({
            where: {
                key: key
            },
            raw: true
        }).then(function (result) {
            return result;
        }).catch(function () {
            return null;
        });
    };

    action.saveData = function (key, value) {
        return app.models.seo.find({
            where: {
                key: key
            }
        }).then(function (result) {
            if (result) {
                return result.updateAttributes({value: value});
            } else {
                return app.models.seo.create({
                    key: key,
                    value: value
                });
            }
        }).catch(function () {
            return null;
        });
    };

    action.render = function (data, view) {
        return component.render(view, data).then(function (html) {
            return html;
        }).catch(function () {
            return null;
        });
    };
};