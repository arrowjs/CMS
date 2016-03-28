'use strict';

let _ = require('arrowjs')._;

/**
 * Check permisison of request
 * @param req - Request of feature
 * @param permission - Permission need to check
 * @returns {boolean}
 */
exports.isAllow = function (req, permission) {
    // Get all permissions of current user
    let permissions = req.session.permissions;

    // Get key of current feature
    let featureName = req.arrowUrl.split('.').pop();
    let result = false;

    /*
     * check option of server.js
     * if role == false => return true (allows all permissions)
     * */
    if (!this.arrowSettings.role) {
        return true;
    }

    // Check permission is object (JSON)
    if (_.isObject(permissions)) {
        if (_.has(permissions, 'feature')) {
            _.map(permissions.feature, function (v, k) {
                if (k === featureName) {
                    permission = (typeof permission === 'string') ? [permission] : permission;
                    _.map(permission, function (val) {
                        _.map(v, function (value) {
                            if (value['name'] == val) {
                                result = true;
                            }
                        })
                    })
                }
            })
        }
    }
    return result;
};

