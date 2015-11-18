/**
 * Created by thangnv on 11/14/15.
 */
'use strict';

/**
 * Add a button.
 * @param {object} req - Request of users.
 * @param {string} route - Route which user access.
 * @param {string} action - Action which user access.
 * @param {string} url - URL which button will be linked to.
 * @return {string}
 */
exports.addButton = function (req, route, action, url) {
    if (req.user != undefined && req.user.acl[route] != undefined) {
        let rules = req.user.acl[route].split(':');

        for (let i in rules) {
            if (rules.hasOwnProperty(i)) {
                if (action == rules[i]) {
                    if (url === undefined) {
                        return route.replace('_', '-');
                    } else {
                        return url;
                    }
                }
            }
        }
    }
    return '';
};

/**
 * Add custom button.
 * @param {string} url - URL which button will be linked to.
 * @returns {string}
 */
exports.customButton = function (url) {
    return url;
};

/**
 * Check module active.
 * @param {object} req - Request of users.
 * @param {string} route - Route which user access.
 * @param {string} action - Action which user access.
 * @returns {boolean}
 */
//exports.allow = function (req, route, action) {
//    if (__modules[route] != undefined && (__modules[route].system || __modules[route].active)) {
//        if (req.user != undefined && req.user.acl[route] != undefined) {
//            let rules = req.user.acl[route].split(':');
//
//            for (let i in rules) {
//                if (rules.hasOwnProperty(i)) {
//                    if (action == rules[i]) {
//                        return true;
//                    }
//                }
//            }
//            return false;
//        } else {
//            return false;
//        }
//    } else {
//        return false;
//    }
//};
