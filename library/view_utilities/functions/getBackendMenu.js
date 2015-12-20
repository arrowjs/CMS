"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;

module.exports = {
    name: "getBackendMenu",
    async: true,
    handler: function (currentUrl, currPermission, callback) {
        let app = this;
        let permissions = currPermission || app.permissions;
        let feature_data = app.featureManager.getAttribute();
        app.redisClient.getAsync(app.getConfig("redis_prefix") + app.getConfig("redis_key.backend_menus"))
            .then(function (menu) {
                let htmlMenu = '<section class="sidebar">' +
                    '<ul class="sidebar-menu">';
                if (menu) {
                    menu = JSON.parse(menu);
                } else {
                    menu = {};
                    menu.sorting = [];
                    menu.default = {
                        title: "MAIN NAVIGATION",
                        features: {}
                    };

                    _.map(feature_data, function (val, key) {
                        if (_.has(val, 'backend_menu')) {
                            menu.sorting.push(key);
                            menu.default.features[key] = val.backend_menu;
                        }
                    })
                }

                htmlMenu += '<li class="header">' + menu.default.title + '</li>';
                _.map(menu.sorting, function (key) {
                    //Display all features have key 'backend_menus' in feature.js
                    if (_.has(menu.default.features, key) && _.has(menu.default.features[key], 'menus') && !_.isUndefined(permissions["feature"][key])) {
                        htmlMenu += '<li class="treeview">';
                        //Display item menu of features
                        if (_.isArray(menu.default.features[key]['menus'])) {
                            htmlMenu += '<a href="#">';
                            htmlMenu += '<i class="' + menu.default.features[key].icon + '"></i> <span>' + menu.default.features[key].title + '</span> <i class="fa fa-angle-left pull-right"></i>';
                            htmlMenu += '</a>';
                            htmlMenu += '<ul class="treeview-menu" style="display: none;">';
                            _.map(menu.default.features[key]['menus'], function (val) {
                                //Check permission of user to display
                                if (isDisplay(val.permission, permissions["feature"][key])) {
                                    htmlMenu += '<li>';
                                    htmlMenu += '<a href="/' + app.getConfig("admin_prefix") + '/' + key + val.link + '">';
                                    htmlMenu += '<i class="fa fa-circle-o"></i> ' + val.title;
                                    htmlMenu += '</a>';
                                    htmlMenu += '</li>';
                                }
                            });
                            htmlMenu += '</ul>';
                            //Display menu parent without items
                        } else if (_.isObject(menu.default.features[key]['menus'])) {
                            htmlMenu += '<a href="/' + app.getConfig("admin_prefix") + '/' + key + menu.default.features[key]['menus']['link'] + '">';
                            htmlMenu += '<i class="' + menu.default.features[key].icon + '"></i> <span>' + menu.default.features[key].title + '</span> <i class="fa fa-angle-left pull-right"></i>';
                            htmlMenu += '</a>';
                        }
                        htmlMenu += '</li>';

                    }
                });

                htmlMenu += '</ul>' +
                '   </section>';
                //set menu json variables to redis
                app.redisClient.setAsync(app.getConfig("redis_prefix") + app.getConfig("redis_key.backend_menus"), JSON.stringify(menu)).then(function () {
                    //return htmlMenu to display on sidebar
                    callback(null, htmlMenu)
                });

            }).catch(function (err) {
                callback(err);
            });
    }
};

/**
 * Sort menu by "sort" property
 * @param {object} menus
 * @returns {array}
 */
function sortMenus(menus) {
    let sortable = [];

    // Add menus to array
    for (let m in menus) {
        if (menus.hasOwnProperty(m)) {
            sortable.push({menu: m, sort: menus[m].sort});
        }
    }

    // Sort menu array
    sortable.sort(function (a, b) {
        if (a.sort < b.sort)
            return -1;
        if (a.sort > b.sort)
            return 1;
        return 0;
    });

    return sortable;
}

/*
 * Check permissions of user with permissions of feature
 * return true if user has leatest one permistion else return false
 * @permistions :  permissions(permissions of feature) of user
 * @permissionsOfFeature: all permissions of feature is defined in feature.js (in backend_menus)
 * */
function isDisplay(permissions, permissionsOfFeature) {
    let result = false;
    if (!_.isArray(permissions)) permissions = [permissions];
    _.map(permissions, function (val) {
        if (_.findIndex(permissionsOfFeature, 'name', val) > -1)
            result = true;
    });

    return result;
}

/**
 * Add active class to current menu
 * @param {string} link - Menu link
 * @param {string} string_to_compare - String to compare with menu link
 * @param {string} css_class - CSS class when not use class "active"
 * @param {integer} index
 * @returns {string}
 */
function active_menu(link, string_to_compare, css_class, index) {
    let arr = link.split('/');
    let st = "active";

    if (css_class) {
        st = css_class;
    }

    if (string_to_compare == '') {
        string_to_compare = 'index';
    }

    if (~string_to_compare.indexOf('/')) {
        string_to_compare = string_to_compare.split('/')[index];
    }

    if (index) {
        let v = arr[index];
        if (!v) {
            v = "index";
        }
        return v === string_to_compare ? st : "";
    }

    return arr[2] == string_to_compare ? st : "";
}
