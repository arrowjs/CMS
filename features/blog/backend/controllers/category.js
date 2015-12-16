'use strict';

let slug = require('slug');
let Promise = require('arrowjs').Promise;

module.exports = function (action, component, app) {

    /**
     * Find category by ID
     */
    action.findById = function (id) {
        return app.models.category.findById(id);
    };

    /**
     * Find category with conditions
     */
    action.find = function (conditions) {
        return app.models.category.find(conditions);
    };

    /**
     * Find all categories with conditions
     */
    action.findAll = function (conditions) {
        return app.models.category.findAll(conditions);
    };

    /**
     * Find and count all categories with conditions
     */
    action.findAndCountAll = function (conditions) {
        return app.models.category.findAndCountAll(conditions);
    };

    /**
     * Count categories
     */
    action.count = function () {
        return app.models.category.count();
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
        if (data.name) {
            data.name = data.name.trim();
            if (!data.alias) data.alias = slug(data.name.toLowerCase());
        }

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

    /**
     * Split string categories from database to array
     */
    action.convertToArray = function (str) {
        str = str.split(':');
        str.shift();
        str.pop(str.length - 1);
        return str;
    };

    /**
     * Update count of categories
     */
    action.updateCount = function (listCategories, table, column, type) {
        return Promise.map(listCategories, function (id) {
            let updateCountQuery = `UPDATE arr_category
                                        SET count = (
                                                SELECT count(id)
                                                FROM ${table}
                                                WHERE ${column} LIKE '%:${id}:%' AND type = '${type}' AND published = 1
                                            )
                                        WHERE id = ${id}`;
            return app.models.rawQuery(updateCountQuery);
        });
    };
};