'use strict';

let slug = require('slug');
let Promise = require('arrowjs').Promise;
let _ = require('arrowjs')._;

module.exports = function (action, component, app) {

    /**
     * Find category by ID
     * @param id {integer} - Id of category
     */
    action.findById = function (id) {
        return app.models.category.findById(id);
    };

    /**
     * Find category with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.find = function (conditions) {
        return app.models.category.find(conditions);
    };

    /**
     * Find all categories with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.findAll = function (conditions) {
        return app.models.category.findAll(conditions);
    };

    /**
     * Find and count all categories with conditions
     * @param conditions {object} - Conditions used in query
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
     * @param data {object} - Data of new category
     * @param type {string} - Type of category
     */
    action.create = function (data, type) {
        data.type = type;
        data.name = data.name.trim();
        if (!data.alias) data.alias = slug(data.name.toLowerCase());

        return app.models.category.create(data);
    };

    /**
     * Update category
     * @param category {object} - Category need to update
     * @param data {object} - New data
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
     * @param ids {array} - Array ids of categories
     */
    action.destroy = function (ids) {
        return app.models.category.destroy({
            where: {
                id: {
                    $in: ids
                }
            }
        })
    };

    /**
     * Split string categories from database to array
     * @param str {string} - String to convert. Example ':1:2:3:'
     */
    action.convertToArray = function (str) {
        if (typeof str == 'string') {
            str = _.compact(str.split(':'));

            // Check elements of str must be integers
            for (var i = 0; i < str.length; i++) {
                if (!Number.isInteger(parseInt(str[i]))) {
                    return [];
                }
            }

            return str;
        } else {
            return [];
        }
    };

    /**
     * Update count of categories
     * @param: listCategories {array} - List ids of categories need to update
     * @param: table {string} - Name of table need to count
     * @param: column {string} - Name of column used to store categories
     * @param: conditions {string} - More conditions if needed
     */
    action.updateCount = function (listCategories, table, column, conditions) {
        conditions = conditions || '';

        return Promise.map(listCategories, function (id) {
            let updateCountQuery = `UPDATE arr_category
                                        SET count = (
                                                SELECT count(id)
                                                FROM ${table}
                                                WHERE ${column} LIKE '%:${id}:%' ${conditions}
                                            )
                                        WHERE id = ${id};`;
            return app.models.rawQuery(updateCountQuery);
        });
    };
};