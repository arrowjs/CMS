/**
 * Created by thangnv on 11/12/15.
 */
'use strict';
let _ = require('arrowjs')._;
let fs = require('fs');
let path = require('path');

let route = 'roles';

module.exports = function (controller, component, app) {

    let itemOfPage = app.getConfig('pagination').numberItem || 10;
    let isAllow = ArrowHelper.isAllow;

    controller.list = function (req, res) {

        // Config ordering
        let column = req.params.sort || 'id';
        let order = req.params.order || '';

        // Store search data to session
        let session_search = {};
        if (req.session.search) {
            session_search = req.session.search;
        }
        session_search[route + '_index_list'] = req.url;
        req.session.search = session_search;

        // Config columns
        let tableStruture = [
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
                link: '/admin/roles/{id}',
                filter: {
                    data_type: 'string'
                }
            },
            {
                column: "modified_at",
                type: 'datetime',
                width: '10%',
                header: __('m_roles_backend_controllers_index_filter_column_modified_at'),
                filter: {
                    data_type: 'datetime'
                }
            },
            {
                column: "status",
                width: '15%',
                header: __('all_table_column_status'),
                filter: {
                    type: 'select',
                    filter_key: 'status',
                    data_source: [
                        {
                            name: "publish"
                        },
                        {
                            name: "un-publish"
                        }
                    ],
                    display_key: 'name',
                    value_key: 'name'
                }
            }
        ];

        // Add toolbar
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addSearchButton(isAllow(req, 'index'));
        toolbar.addRefreshButton('/admin/roles');
        toolbar.addCreateButton(isAllow(req, 'create'), '/admin/roles/create');
        toolbar.addDeleteButton(isAllow(req, 'delete'));
        toolbar = toolbar.render();

        let filter = ArrowHelper.createFilter(req, res, tableStruture, {
            rootLink: '/admin/roles/sort',
            itemOfPage: itemOfPage
        });

        // List roles
        app.models.role.findAll({
            where: filter.values,
            order: column + " " + order
        }).then(function (roles) {
            res.backend.render('index', {
                title: __('m_roles_backend_controllers_index_findAll_title'),
                items: roles,
                toolbar: toolbar
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.backend.render('index', {
                title: __('m_roles_backend_controllers_index_findAll_title'),
                toolbar: toolbar,
                roles: null
            });
        });
    };

    controller.view = function (req, res) {
        // Add button
        let back_link = '/admin/roles';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_index_list']) {
            back_link = '/admin' + search_params[route + '_index_list'];
        }
        res.locals.backButton = back_link;
        res.locals.saveButton = 'update';

        // Add toolbar
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(isAllow(req, 'update'));
        toolbar = toolbar.render();

        // Get role by id
        app.models.role.find({
            where: {
                id: req.params.rid
            }
        }).then(function (roles) {
            res.backend.render('new', {
                title: __('m_roles_backend_controllers_index_view_title'),
                features: app.permissions.feature,
                role: roles,
                permissions: JSON.parse(roles.permissions),
                toolbar: toolbar
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.backend.render('new', {
                title: __('m_roles_backend_controllers_index_view_title'),
                features: app.permissions.feature,
                role: null,
                permissions: null,
                toolbar: toolbar
            });
        });
    };

    controller.update = function (req, res) {
        let back_link = '/admin/roles';
        let search_params = req.session.search;
        let permissions = {feature: {}};
        if (search_params && search_params[route + '_index_list']) {
            back_link = '/admin' + search_params[route + '_index_list'];
        }

        // Get role by id
        app.models.role.find({
            where: {
                id: req.params.rid
            }
        }).then(function (role) {
            for (let k in req.body) {
                if (k != 'title' && k != 'status') {
                    permissions.feature[k] = [];
                    if (typeof req.body[k] == 'string') {
                        req.body[k] = new Array(req.body[k]);
                    }
                    for (let temp of req.body[k]) {
                        permissions.feature[k].push({name: temp});
                    }
                }
            }

            // Update role
            return role.updateAttributes({
                name: req.body.title,
                status: req.body.status,
                permissions: JSON.stringify(permissions)
            });
        }).then(function () {
            req.flash.success(__('m_roles_backend_controllers_index_update_flash_success'));
            res.redirect(back_link);
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
        });
    };

    controller.create = function (req, res) {
        // Add button
        let back_link = '/admin/roles';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_index_list']) {
            back_link = '/admin' + search_params[route + '_index_list'];
        }

        // Add toolbar
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(isAllow(req, 'create'));
        toolbar = toolbar.render();

        res.backend.render('new', {
            title: __('m_roles_backend_controllers_index_create_title'),
            features: app.permissions.feature,
            toolbar: toolbar
        });
    };

    controller.save = function (req, res) {
        let back_link = '/admin/roles';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_index_list']) {
            back_link = '/admin' + search_params[route + '_index_list'];
        }

        let permissions = {feature: {}};
        for (let k in req.body) {
            if (req.body.hasOwnProperty(k)) {
                if (k != 'title' && k != 'status') {
                    permissions.feature[k] = [];
                    for (let temp of req.body[k]) {
                        permissions.feature[k].push({name: temp});
                    }
                }
            }
        }

        // Create role
        app.models.role.create({
            name: req.body.title,
            status: req.body.status,
            permissions: JSON.stringify(permissions)
        }).then(function () {
            req.flash.success(__('m_roles_backend_controllers_index_create_save_flash_success'));
            res.redirect(back_link);
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
        });
    };

    controller.delete = function (req, res) {
        // Delete role
        app.models.role.destroy({
            where: {
                id: {
                    "in": req.body.ids.split(',')
                }
            }
        }).then(function () {
            req.flash.success(__('m_roles_backend_controllers_index_delete_flash_success'));
            res.sendStatus(204);
        }).catch(function (error) {
            if (error.name == 'SequelizeForeignKeyConstraintError') {
                req.flash.error('m_roles_backend_controllers_index_delete_flash_error');
                res.sendStatus(200);
            } else {
                req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                res.sendStatus(200);
            }
        });
    };
};