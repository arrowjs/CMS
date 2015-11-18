'use strict';
//
let _ = require('lodash');
let promise = require('bluebird');
let createFilter = require(__base + '/library/js_utilities/createFilter');

module.exports = function (controller, component, application) {
    controller.index = function (req, res) {

        // Add button
        res.addButton({
            createButton: '/admin/menu/create',
            deleteButton: 'delete'
        });

        // Config ordering
        let column = req.params.sort || 'id';
        let order = req.params.order || '';

        let table = [
            {
                column: "id",
                width: '1%',
                header: "",
                type: 'checkbox'
            },
            {
                column: "name",
                width: '25%',
                header: __('all_table_column_name'),
                link: '/admin/menu/update/{id}'
            }
        ];

        // Config columns
        let filter = createFilter(req, res, table, {
            rootLink: '/admin/menu/sort'
        });

        component.models.menus.findAll({
            order: column + " " + order,
            raw: true
        }).then(function (menus) {
            // Render view
            res.render('index', {
                title: __('m_menus_backend_controller_index_render_title'),
                items: menus
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

            // Render view if has error
            res.render(req, res, 'index', {
                title: __('m_menus_backend_controller_index_render_title'),
                menus: null
            });
        });
    };

    controller.create = function (req, res) {
        //let back_link = '/admin/menus';
        //let search_params = req.session.search;
        //if (search_params && search_params[route + '_index_index']) {
        //    back_link = '/admin' + search_params[route + '_index_index'];
        //}

        res.addButton({
            backButton: "/admin/menu",
            saveButton: true
        })

        // Get module links
        //res.locals.setting_menu_module = __setting_menu_module;

        // Render view
        res.render('new', {
            title: __('m_menus_backend_controller_create_render_title')
        });
    };
    controller.menuById = function (req, res, next, id) {
        component.models.menus.findById(id).then(function (menu) {
            res.locals.menu = menu;
            return component.models.menu_detail.findAll({
                where: {
                    menu_id: id
                },
                raw: true
            });
        }).then(function (menu_details) {
            res.locals.menu_details = JSON.stringify(menu_details);
            next();
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            next();
        });
    };

    controller.delete = function (req, res) {
        component.models.menus.destroy({
            where: {
                id: {
                    "in": req.body.ids.split(',')
                }
            }
        }).then(function () {
            req.flash.success(__.t('m_menus_backend_controller_delete_flash_success'));
            res.sendStatus(204);
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.sendStatus(200);
        });
    };

    controller.update = function (req, res) {
        // Find menu to update
        component.models.menus.find({
            where: {
                id: req.params.cid
            }
        }).then(function (menu) {
            // Update menu
            return menu.updateAttributes({
                name: req.body.name,
                menu_order: req.body.output
            });
        }).then(function (menu) {
            // Delete old menu detail
            return component.models.menu_detail.destroy({
                where: {
                    menu_id: menu.id
                }
            });
        }).then(function () {
            let promises = [];

            // Create menu detail
            for (let i in req.body.title) {
                promises.push(
                    component.models.menu_detail.create({
                        id: req.body.mn_id[i],
                        menu_id: req.params.cid,
                        name: req.body.title[i],
                        link: req.body.url[i],
                        attribute: req.body.attribute[i]
                    })
                );
            }

            return promise.all(promises);
        }).then(function () {
            req.flash.success(__('m_menus_backend_controller_update_flash_success'));
            res.redirect('/admin/menu/update/' + req.params.cid);
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.render('new');
        });
    };

    controller.saveSortAdminMenu = function (req, res) {
        let systems = req.body.s || [];
        let defaults = req.body.d || [];

        application.redisClient.getAsync(application.getConfig("redis_prefix") + application.getConfig("redis_key.backend_menus"))
            .then(function (data) {
                let menus = JSON.parse(data);
                if (systems.length > 0) {
                    menus.sorting.systems = systems;
                }
                if (defaults.length > 0) {
                    menus.sorting.default = defaults;
                }

                application.redisClient.setAsync(application.getConfig("redis_prefix") + application.getConfig("redis_key.backend_menus"), JSON.stringify(menus))
                    .then(function () {
                        res.sendStatus(200);
                    });
            })

    };

    controller.sortAdminMenu = function (req, res) {
        res.addButton({
            saveButton : true
        });
        application.redisClient.getAsync(application.getConfig("redis_prefix") + application.getConfig("redis_key.backend_menus"))
            .then(function (data) {
                let menus = JSON.parse(data);
                res.render('admin_sort', {
                    title: __('m_menus_backend_controller_sort_admin_menu_render_title'),
                    menus: menus
                });
            })

    };

    controller.save = function (req, res) {
        let menu_id = 0;
        // Create menu
        component.models.menus.create({
            name: req.body.name,
            menu_order: req.body.output
        }).then(function (menu) {
            menu_id = menu.id;

            // Delete old menu detail
            return component.models.menu_detail.destroy({
                where: {
                    menu_id: menu_id
                }
            });
        }).then(function () {
            let promises = [];

            // Create menu detail
            for (let i in req.body.title) {
                promises.push(
                    component.models.menu_detail.create({
                        id: req.body.mn_id[i],
                        menu_id: menu_id,
                        name: req.body.title[i],
                        link: req.body.url[i],
                        attribute: req.body.attribute[i]
                    })
                );
            }

            return promise.all(promises);
        }).then(function () {
            req.flash.success(__('m_menus_backend_controller_create_flash_success'));
            res.redirect('/admin/menu/update/' + menu_id);
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            // Re-render view if has error
            res.render('new');
        });
    };

    controller.read = function (req, res) {
        // Add button
        let back_link = '/admin/menu';
        //let search_params = req.session.search;
        //if (search_params && search_params[route + '_index_index']) {
        //    back_link = '/admin' + search_params[route + '_index_index'];
        //}

        res.addButton({
            backButton: back_link
        });

        // Get module links
        //res.locals.setting_menu_module = __setting_menu_module;

        // Render view
        res.render('new', {
            title: __('m_menus_backend_controller_read_render_title')
        });
    };
};
