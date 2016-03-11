'use strict';

let _ = require('arrowjs')._;
let promise = require('arrowjs').Promise;
let fs = require("fs");
let readFileAsync = promise.promisify(fs.readFile);
let logger = require('arrowjs').logger;

module.exports = function (controller, component, app) {

    let isAllow = ArrowHelper.isAllow;

    controller.index = function (req, res) {
        // Add button
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addCreateButton(isAllow(req, 'index'), '/admin/menu/create');
        toolbar.addDeleteButton(isAllow(req, 'delete'));
        toolbar = toolbar.render();

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
        let filter = ArrowHelper.createFilter(req, res, table, {
            rootLink: '/admin/menu/sort',
            backLink: 'menu_back_link'
        });

        app.models.menu.findAll({
            order: filter.order,
            raw: true
        }).then(function (menus) {
            // Render view
            res.render('index', {
                title: __('m_menus_backend_controller_index_render_title'),
                items: menus,
                toolbar: toolbar
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            // Render view if has error
            res.render('index', {
                title: __('m_menus_backend_controller_index_render_title'),
                menus: null
            });
        });
    };

    controller.create = function (req, res) {
        // Add button
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'menu_back_link');
        toolbar.addSaveButton(isAllow(req, 'create'));

        readFileAsync(__base + "themes/frontend/" + app.getConfig('frontendTheme') + "/theme.json", "utf8")
            .then(function (data) {
                let menus = JSON.parse(data).sidebars;
                let features = [];
                if (app.feature)
                    for (let k in app.feature) {
                        if (app.feature[k].hasOwnProperty('add_link_menu')) {
                            for (let key in app.feature[k]['add_link_menu']) {
                                features.push(app.feature[k]['add_link_menu'][key]);
                            }
                        }
                    }
                // Render view
                res.render('new', {
                    title: __('m_menus_backend_controller_create_render_title'),
                    setting_menu_feature: features,
                    toolbar: toolbar.render(),
                    menu_locations: menus
                });
            }).catch(function (err) {
                logger.error(err);
                res.render('new', {
                    title: __('m_menus_backend_controller_create_render_title'),
                    setting_menu_feature: null,
                    toolbar: toolbar.render()
                });
            });
    };

    controller.menuById = function (req, res, next, id) {
        app.models.menu.findById(id).then(function (menu) {
            res.locals.menu = menu;
            return app.models.menu_detail.findAll({
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
        app.models.menu.destroy({
            where: {
                id: {
                    "in": req.body.ids.split(',')
                }
            }
        }).then(function () {
            req.flash.success(__('m_menus_backend_controller_delete_flash_success'));
            res.sendStatus(204);
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.sendStatus(200);
        });
    };

    controller.saveSortAdminMenu = function (req, res) {
        let defaults = req.body['d[]'] || [];
        app.redisClient.getAsync(app.getConfig("redis_prefix") + app.getConfig("redis_key.backend_menus"))
            .then(function (data) {
                let menus = JSON.parse(data);
                if (defaults.length > 0) {
                    menus.sorting = defaults;
                }

                app.redisClient.setAsync(app.getConfig("redis_prefix") + app.getConfig("redis_key.backend_menus"), JSON.stringify(menus))
                    .then(function () {
                        res.sendStatus(200);
                    });
            });
    };

    controller.sortAdminMenu = function (req, res) {
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addSaveButton(isAllow(req, 'update'));

        app.redisClient.getAsync(app.getConfig("redis_prefix") + app.getConfig("redis_key.backend_menus"))
            .then(function (data) {
                let menus = JSON.parse(data);
                res.render('admin_sort', {
                    title: __('m_menus_backend_controller_sort_admin_menu_render_title'),
                    menus: menus,
                    toolbar: toolbar.render()
                });
            });
    };

    controller.update = function (req, res) {
        //check if string => convert to Array
        if (_.isString(req.body.title)){
            req.body.title = [req.body.title];
            req.body.mn_id = [req.body.mn_id];
            req.body.attribute = [req.body.attribute];
            req.body.url = [req.body.url];
        }
        // Find menu to update
        app.models.menu.find({
            where: {
                id: req.params.mid
            }
        }).then(function (menu) {
            // Update menu
            return menu.updateAttributes({
                name: req.body.name,
                menu_order: req.body.output
            });
        }).then(function (menu) {
            // Delete old menu detail
            return app.models.menu_detail.destroy({
                where: {
                    menu_id: menu.id
                }
            });
        }).then(function (menu) {
            let promises = [];
            // Create menu detail
            for (let i in req.body.title) {
                promises.push(
                    app.models.menu_detail.create({
                        detail_id: req.body.mn_id[i],
                        menu_id: req.params.mid,
                        name: req.body.title[i],
                        link: req.body.url[i],
                        attribute: req.body.attribute[i]
                    })
                );
            }
            return promise.all(promises);
        }).then(function () {
            req.flash.success(__('m_menus_backend_controller_update_flash_success'));
            res.redirect('/admin/menu/update/' + req.params.mid);
        }).catch(function (error) {
            logger.error(error);
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect('/admin/menu/create');
        });
    };

    controller.save = function (req, res) {
        let menu_id = 0;
        //check if string => convert to Array
        if (_.isString(req.body.title)){
            req.body.title = [req.body.title];
            req.body.mn_id = [req.body.mn_id];
            req.body.attribute = [req.body.attribute];
            req.body.url = [req.body.url];
        }
        app.models.menu.create({
            name: req.body.name,
            menu_order: req.body.output
        }).then(function (menu) {
            menu_id = menu.id;
            // Delete old menu detail
            return app.models.menu_detail.destroy({
                where: {
                    menu_id: menu_id
                }
            });
        }).then(function () {
            let promises = [];
            // Create menu detail
            for (let i in req.body.title) {
                promises.push(
                    app.models.menu_detail.create({
                        detail_id: req.body.mn_id[i],
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
            res.redirect('/admin/menu/create');
        });
    };

    controller.read = function (req, res) {
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'menu_back_link');
        toolbar.addSaveButton(isAllow(req, 'create'));

        readFileAsync(__base + "themes/frontend/" + app.getConfig('frontendTheme') + "/theme.json", "utf8")
            .then(function (data) {
                let menus = JSON.parse(data).sidebars;
                let features = [];
                if (app.feature)
                    for (let k in app.feature) {
                        if (app.feature[k].hasOwnProperty('add_link_menu')) {
                            for (let key in app.feature[k]['add_link_menu']) {
                                features.push(app.feature[k]['add_link_menu'][key]);
                            }
                        }
                    }
                // Render view
                res.render('new', {
                    title: __('m_menus_backend_controller_create_render_title'),
                    setting_menu_feature: features,
                    toolbar: toolbar.render(),
                    menu_locations: menus
                });
            }).catch(function (err) {
                logger.error(err);
                res.render('new', {
                    title: __('m_menus_backend_controller_create_render_title'),
                    setting_menu_feature: null,
                    toolbar: toolbar.render()
                });
            })
    };
};
