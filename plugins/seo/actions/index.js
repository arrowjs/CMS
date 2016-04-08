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
        let value;

        try {
            value = JSON.parse(data.value);
        } catch (err) {
            value = {};
        }

        return component.render(view, {
            meta_description: value.meta_description,
            meta_keywords: value.meta_keywords
        }).then(function (html) {
            return html;
        }).catch(function () {
            return null;
        });
    };
};