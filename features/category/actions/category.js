'use strict';

let slug = require('slug');
let log = require('arrowjs').logger;

module.exports = function (action, component, app) {

    /**
     * Find category by ID
     */
    action.findById = function (id) {
        return app.models.category.findById(id);
    };

    /**
     * Find categories with conditions
     */
    action.find = function (conditions) {
        return app.models.category.find(conditions);
    };

    /**
     * Find and count categories with conditions
     */
    action.findAndCountAll = function (conditions) {
        return app.models.category.findAndCountAll(conditions);
    };

    /**
     * Create new category
     */
    action.create = function (data, type) {
        data.type = type;
        data.name = data.name.trim();
        if (!data.alias) data.alias = slug(data.name.toLowerCase());
        return app.models.category.create(data);
    };

    /**
     * Update category
     */
    action.update = function (category, data) {
        data.name = data.name.trim();
        if (!data.alias) data.alias = slug(data.name.toLowerCase());
        return category.updateAttributes(data);
    };

    /**
     * Delete categories by ids
     */
    action.destroy = function (ids) {
        return app.models.category.destroy({
            where: {
                id: {
                    'in': ids
                }
            }
        })
    };

};