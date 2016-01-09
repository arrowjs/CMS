"use strict";

module.exports = function (action, component, app) {

    action.getData = function (key) {
        return component.models.seo.find({
            where: {
                key: key
            },
            raw: true
        }).then(function (result) {
            return result
        }).catch(function (err) {
            return null;
        });
    };

    action.saveData = function (key, value) {
        return component.models.seo.find({
            where: {
                key: key
            }
        }).then(function (result) {
            if (result) {
                return result.updateAttributes({value: value})
            } else {
                return component.models.seo.create({
                    key: key,
                    value: value
                })
            }
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