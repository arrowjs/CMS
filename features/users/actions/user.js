'use strict';

module.exports = function (action, comp, app) {

    /**
     * Find user by ID
     * @param id {integer} - Id of user
     */
    action.findById = function (id) {
        return app.models.user.findById(id);
    };

    /**
     * Find user by email
     * @param email {string} - Email of user
     */
    action.findByEmail = function (email) {
        return app.models.user.find({
            where: {
                user_email: email.toLowerCase()
            }
        });
    };

    /**
     * Find user with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.find = function (conditions) {
        return app.models.user.find(conditions);
    };

    /**
     * Find user with conditions, include roles
     * @param conditions {object} - Conditions used in query
     */
    action.findWithRole = function (conditions) {
        return app.models.user.find({
            include: [app.models.role],
            where: conditions
        });
    };

    /**
     * Find all users with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.findAll = function (conditions) {
        return app.models.user.findAll(conditions);
    };

    /**
     * Find and count all users with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.findAndCountAll = function (conditions) {
        return app.models.user.findAndCountAll(conditions);
    };

    /**
     * Count users
     */
    action.count = function () {
        return app.models.user.count()
    };

    /**
     * Create new user
     * @param data {object} - Data of new user
     */
    action.create = function (data) {
        data = optimizeData(data);
        return app.models.user.create(data);
    };

    /**
     * Update user
     * @param user {object} - User need to update
     * @param data {object} - New data
     */
    action.update = function (user, data) {
        data = optimizeData(data, user);
        return user.updateAttributes(data);
    };

    /**
     * Delete users by ids
     * @param ids {array} - Array ids of users
     */
    action.destroy = function (ids) {
        return app.models.user.destroy({
            where: {
                id: {
                    $in: ids
                }
            }
        })
    };

    function optimizeData(data, user) {
        // Trim display name
        if (data.display_name) data.display_name = data.display_name.trim();

        if (user) {
            // Get role of user
            if (data.role_id && !data.role_ids) {
                data.role_ids = user.role_ids;
            } else if (!data.role_id && data.role_ids) {
                data.role_id = user.role_id;
            }
        }

        if (data.role_id) {
            if (data.role_ids) {
                // Check role_id must in role_ids
                data.role_ids = data.role_ids.toString().split(',');
                if (data.role_ids.indexOf(data.role_id.toString()) === -1) data.role_id = data.role_ids[0];
            } else {
                data.role_id = data.role_ids = null;
            }
        }

        if (data.role_ids === null) {
            data.role_id = data.role_ids = null;
        }

        // Convert role_ids to string
        if (Array.isArray(data.role_ids)) data.role_ids = data.role_ids.toString();

        return data;
    }

};