"use strict";

let _ = require('lodash');
let log = require('arrowjs').logger;

module.exports = {

    async: true,

    /**
     * Get sidebar by name
     *
     * @param sidebarName - Name of sidebar
     * @param callback - Content of sidebar
     */
    handler: function (current_url, permissions, callback) {
        let app = this;
        let feature_data = app.featureManager.getAttribute();

        let menus = {};

        menus.default = {
            title: 'Main Navigation',
            sort: 1,
            modules: {}
        };

        // System group
        menus.systems = {
            title: 'Systems',
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


        let html = '<section class="sidebar"><ul class="sidebar-menu">';
        let sortGroups = sortMenus(menus);

        for (let i in sortGroups) {
            let group = menus[sortGroups[i].menu];

            if (!group.title) continue;

            html += `<li class="header">${group.title}</li>`;

            let sortModules = menus.sorting[sortGroups[i].menu];

            for (let y in sortModules) {
                let moduleName = sortModules[y];

                let subMenu = group.modules[moduleName];
                let icon = subMenu.icon || 'fa fa-circle-o text-danger';

                let menu_class = active_menu(current_url, moduleName.replace('-', '_'));

                html += `<li class="treeview ${menu_class}"><a href="{{link}}"><i class="${icon}"></i> <span> ${subMenu.title} </span>`;

                if (subMenu.menus.length > 1) {
                    html = html.replace('{{link}}', '#');
                    html += '<i class="fa fa-angle-right pull-right"></i></a>';
                    html += '<ul class="treeview-menu">';

                    for (let z in subMenu.menus) {
                        let mn = subMenu.menus[z];
                        //if (permissions.feature[moduleName].indexOf(mn.rule) > -1) {
                            //TODO :need check role here
                            menu_class = active_menu(current_url, mn.link.replace('/', ''), "active", 3);
                            html += `<li class="treeview ${menu_class}"><a href="${'/admin/' + (moduleName + mn.link)}"><i class="fa fa-circle-o"></i> <span> ${mn.title} </span>`;
                        //}
                    }
                    html += '</ul></li>';
                } else {
                    if (group.title == 'Systems') {
                        html = html.replace('{{link}}', '/admin/' + moduleName);
                    } else {
                        html = html.replace('{{link}}', '/admin' + subMenu.menus[0].link);
                    }
                    html += '</a></li>';
                }
            }
        }
        html += '</ul></section>'


        callback(null, html)
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
