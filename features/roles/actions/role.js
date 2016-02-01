'use strict';

module.exports = function (action, comp, app) {

    /**
     * Find role by ID
     * @param id {integer} - Id of role
     */
    action.findById = function (id) {
        return app.models.role.findById(id);
    };

    /**
     * Find role with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.find = function (conditions) {
        return app.models.role.find(conditions);
    };

    /**
     * Find all roles with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.findAll = function (conditions) {
        return app.models.role.findAll(conditions);
    };

    /**
     * Find and count all roles with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.findAndCountAll = function (conditions) {
        return app.models.role.findAndCountAll(conditions);
    };

    /**
     * Count roles
     */
    action.count = function () {
        return app.models.role.count()
    };

    /**
     * Create new role
     * @param data {object} - Data of new role
     */
    action.create = function (data) {
        return app.models.role.create(data);
    };

    /**
     * Update role
     * @param role {object} - Role need to update
     * @param data {object} - New data
     */
    action.update = function (role, data) {
        return role.updateAttributes(data);
    };

    /**
     * Delete roles by ids
     * @param ids {array} - Array ids of roles
     */
    action.destroy = function (ids) {
        return app.models.role.destroy({
            where: {
                id: {
                    $in: ids
                }
            }
        })
    };

};