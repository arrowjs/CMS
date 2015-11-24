"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;

module.exports = {
    name: "getBackendMenu",

    async: true,

    /**
     * Get sidebar by name
     *
     * @param sidebarName - Name of sidebar
     * @param callback - Content of sidebar
     */
    handler: function (current_url,currPermission, callback) {
        let app = this;
        let permissions =  currPermission || app.permissions;
        let feature_data = app.featureManager.getAttribute();
        app.redisClient.getAsync(app.getConfig("redis_prefix") + app.getConfig("redis_key.backend_menus")).then(function (data) {
            let menus;
            if (data) {
                menus = JSON.parse(data)
            } else {
                menus = {};

                menus.default = {
                    title: 'Main Navigation',
                    sort: 1,
                    modules: {}
                };

                // System group
                menus.systems = {
                    title: 'MAIN NAVIGATION',
                    sort: 2,
                    modules: {}
                };

                // Sorting menu
                menus.sorting = {};
                menus.sorting.default = [];
                menus.sorting.systems = [];

                Object.keys(feature_data).map(function (feature_name) {
                    if (feature_data[feature_name].backend_menu) {
                        if (feature_data[feature_name].system) {
                            menus.sorting.systems.push(feature_name);
                            menus.systems.modules[feature_name] = feature_data[feature_name].backend_menu;
                        } else if (feature_data[feature_name].active) {
                            menus.sorting.defaults.push(feature_name);
                            menus.defaults.modules[feature_name] = feature_data[feature_name].backend_menu;
                        }
                    }
                });
            }

            let html = '<section class="sidebar"><ul class="sidebar-menu">';
            let sortGroups = sortMenus(menus);


            for (let i in sortGroups) {
                let group = menus[sortGroups[i].menu];

                if (!group.title) continue;

                if (JSON.stringify(group.modules) === '{}') continue;
                html += `<li class="header">${group.title}</li>`;

                let sortModules = menus.sorting[sortGroups[i].menu];

                for (let y in sortModules) {
                    let moduleName = sortModules[y];

                    let subMenu = group.modules[moduleName];
                    let icon = subMenu.icon || 'fa fa-circle-o text-danger';

                    let menu_class = active_menu(current_url, moduleName.replace('-', '_'));

                    //only display this menu if user exits greater than one permission
                    if (permissions.feature.hasOwnProperty(moduleName)){
                        html += `<li class="treeview ${menu_class}"><a href="{{link}}"><i class="${icon}"></i> <span> ${subMenu.title} </span>`;
                        if (subMenu.menus.length > 1) {
                            html = html.replace('{{link}}', '#');
                            html += '<i class="fa fa-angle-left pull-right"></i></a>';
                            html += '<ul class="treeview-menu">';

                            for (let z in subMenu.menus) {
                                let mn = subMenu.menus[z];

                                let flag = false;
                                for(let t in permissions.feature[moduleName]){
                                    if(permissions.feature[moduleName][t].name === mn.permission)
                                        flag = true;
                                }
                                if (flag || !app.arrowSettings.role) {
                                    menu_class = active_menu(current_url, mn.link.replace('/', ''), "active", 3);
                                    html += `<li class="treeview ${menu_class}">
                                <a href="${'/'+app.getConfig("admin_prefix")+'/' + (moduleName + mn.link)}">
                                <i class="fa fa-circle-o"></i> <span> ${mn.title}</span>
                                </a>`;
                                }
                            }
                            html += '</ul></li>';
                        } else {
                            if (typeof subMenu.menus.length == 'number') {
                                html = html.replace('{{link}}', '/'+app.getConfig("admin_prefix")+'/'+ subMenu.menus[0].link);
                            } else {
                                html = html.replace('{{link}}', '/'+app.getConfig("admin_prefix")+'/'+ moduleName);
                            }
                            html += '</a></li>';
                        }
                    }
                }
            }
            html += '</ul></section>';

            app.redisClient.setAsync(app.getConfig("redis_prefix") + app.getConfig("redis_key.backend_menus"), JSON.stringify(menus)).then(function () {
                callback(null, html)
            });

        }).catch(function (err) {
            callback(err)
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
};


/**
 * Add active class to current menu
 * @param {string} value - Menu link
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
};
