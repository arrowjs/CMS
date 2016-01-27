'use strict';

let _ = require('arrowjs')._;
let promise = require('arrowjs').Promise;
let fs = require('fs');

let path = require('path');
let slug = require('slug');
let writeFileAsync = promise.promisify(fs.writeFile);
let readdirAsync = promise.promisify(fs.readdir);
let formidable = require('formidable');
promise.promisifyAll(formidable);

let logger = require('arrowjs').logger;
let view_template = 'new';
let folder_upload = '/img/users/';
let route = 'users';

module.exports = function (controller, component, app) {

    let redis = app.redisClient;
    let adminPrefix = app.getConfig('admin_prefix') || 'admin';
    let redisPrefix = app.getConfig('redis_prefix') || 'arrowCMS_';
    let itemOfPage = app.getConfig('pagination').numberItem || 10;
    let isAllow = ArrowHelper.isAllow;

    controller.list = function (req, res) {
        let tableStructure = [
            {
                column: "id",
                width: '8%',
                header: "ID",
                filter: {
                    model: 'user',
                    data_type: 'number'
                }
            },
            {
                column: "display_name",
                width: '15%',
                header: __('m_users_backend_full_name'),
                link: '/admin/users/{id}',
                filter: {
                    data_type: 'string'
                }
            },
            {
                column: "user_email",
                width: '15%',
                header: __('all_table_column_email'),
                filter: {
                    data_type: 'string'
                }
            },
            {
                column: "role.name",
                width: '10%',
                header: __('all_table_column_role'),
                link: '/admin/roles/{role.id}',
                filter: {
                    type: 'select',
                    filter_key: 'role_id',
                    data_source: 'role', // name of models (in older version is name of table)
                    display_key: 'name',
                    value_key: 'id'
                }
            },
            {
                column: "user_status",
                width: '10%',
                header: __('all_table_column_status'),
                filter: {
                    type: 'select',
                    filter_key: 'user_status',
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
        toolbar.addRefreshButton('/admin/users');
        toolbar.addCreateButton(isAllow(req, 'create'), '/admin/users/create');
        toolbar = toolbar.render();

        // Config columns
        let filter = ArrowHelper.createFilter(req, res, tableStructure, {
            rootLink: '/admin/users/$page',
            limit: itemOfPage,
            backLink: 'user_back_link'
        });

        // List users
        app.feature.users.actions.findAndCountAll({
            attributes: filter.attributes,
            include: [
                {
                    model: app.models.role
                }
            ],
            order: filter.order,
            limit: filter.limit,
            offset: filter.offset,
            where: filter.conditions
        }).then(function (results) {
            let totalPage = Math.ceil(results.count / itemOfPage);

            res.backend.render('index', {
                title: __('m_users_backend_controllers_index_list'),
                items: results.rows,
                totalPage: totalPage,
                toolbar: toolbar,
                queryString: (req.url.indexOf('?') == -1) ? '' : ('?' + req.url.split('?').pop())
            });
        }).catch(function (error) {
            logger.error(error);
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.backend.render('index', {
                title: __('m_users_backend_controllers_index_list'),
                totalPage: 1,
                items: null
            });
        });
    };

    controller.create = function (req, res) {
        // Add button on view
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'user_back_link');
        toolbar.addSaveButton(isAllow(req, 'index'));
        toolbar = toolbar.render();

        // Get list roles
        app.feature.roles.actions.findAll({
            order: "id ASC"
        }).then(function (roles) {
            res.backend.render(view_template, {
                title: __('m_users_backend_controllers_index_add_user'),
                roles: roles,
                toolbar: toolbar
            });
        }).catch(function (error) {
            logger.error(error);
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.backend.render(view_template, {
                title: __('m_users_backend_controllers_index_add_user'),
                roles: null,
                toolbar: toolbar
            });
        });
    };

    controller.save = function (req, res, next) {
        // Get form data
        let data = req.body;

        return new Promise(function (fulfill, reject) {
            if (data.base64 && data.base64 != '') {
                let fileName = folder_upload + slug(data.user_email).toLowerCase() + '.png';
                let base64Data = data.base64.replace(/^data:image\/png;base64,/, "");

                return writeFileAsync(__base + 'upload' + fileName, base64Data, 'base64').then(function () {
                    data.user_image_url = fileName;
                    fulfill(data);
                }).catch(function (err) {
                    reject(err);
                });
            } else fulfill(data);
        }).then(function (result) {
                return app.feature.users.actions.create(result);
            }).then(function (user) {
                req.flash.success(__('m_users_backend_controllers_index_add_flash_success'));
                res.redirect('/admin/users/' + user.id);
            }).catch(function (error) {
                logger.error(error);
                if (error.name == ArrowHelper.UNIQUE_ERROR) {
                    req.flash.error(__('m_users_backend_controllers_index_flash_email_exist'));
                    return next();
                } else {
                    req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                    return next();
                }
            });
    };

    controller.view = function (req, res) {
        // Add button
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'user_back_link');
        toolbar.addSaveButton(isAllow(req, 'index'));
        toolbar = toolbar.render();

        // Get user by session and list roles
        app.feature.roles.actions.findAll().then(function (roles) {
            res.backend.render(view_template, {
                title: __('m_users_backend_controllers_index_update'),
                roles: roles,
                item: req._user,
                id: req.params.uid,
                toolbar: toolbar
            });
        }).catch(function (error) {
            logger.error(error);
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.backend.render(view_template, {
                title: __('m_users_backend_controllers_index_update'),
                roles: null,
                item: null,
                id: 0,
                toolbar: toolbar
            });
        });
    };

    controller.update = function (req, res, next) {
        let userAction = app.feature.users.actions;
        let edit_user = req._user;
        let data = req.body;

        return new Promise(function (fulfill, reject) {
            if (data.base64 && data.base64 != '' && data.base64 != user.user_image_url) {
                let fileName = folder_upload + slug(user.user_email).toLowerCase() + '.png';
                let base64Data = data.base64.replace(/^data:image\/png;base64,/, "");

                return writeFileAsync(__base + 'upload' + fileName, base64Data, 'base64').then(function () {
                    data.user_image_url = fileName;
                    fulfill(data);
                }).catch(function (err) {
                    reject(err);
                });
            } else
                fulfill(data);
        }).then(function (data) {
                return userAction.update(edit_user, data).then(function (result) {
                    req.flash.success(__('m_users_backend_controllers_index_update_flash_success'));

                    if (req.url.indexOf('profile') !== -1) {
                        redis.del(req.user.key, function (err, reply) {
                            if (!err)
                                userAction.findWithRole({id: result.id}).then(function (user) {
                                    let user_tmp = JSON.parse(JSON.stringify(user));
                                    user_tmp.key = redisPrefix + 'current-user-' + user.id;
                                    user_tmp.acl = JSON.parse(user_tmp.role.permissions);
                                    redis.setex(user_tmp.key, 300, JSON.stringify(user_tmp));
                                }).catch(function (error) {
                                    logger.error(error.stack);
                                });
                        });
                        return res.redirect('/' + adminPrefix + '/users/profile/' + req.params.uid);
                    }
                    return res.redirect('/' + adminPrefix + '/users/' + req.params.uid);
                });
            }).catch(function (error) {
                logger.error(error);
                if (error.name == ArrowHelper.UNIQUE_ERROR) {
                    req.flash.error(__('m_users_backend_controllers_index_flash_email_exist'));
                    return next();
                } else {
                    req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                    return next();
                }
            });
    };

    controller.delete = function (req, res) {
        // Check delete current user
        let ids = req.body.ids;
        let id = req.user.id;
        let index = ids.indexOf(id);

        if (index == -1) {
            app.feature.users.actions.destroy(ids.split(',')).then(function () {
                req.flash.success(__('m_users_backend_controllers_index_delete_flash_success'));
                res.sendStatus(204);
            }).catch(function (error) {
                req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                res.sendStatus(200);
            });
        } else {
            req.flash.error('Cannot delete yourself');
            res.sendStatus(200);
        }
    };

    /**
     * Profile
     */
    controller.profile = function (req, res) {
        // Get current user role
        let role_ids = [];
        if (!req.user.role_ids && req.user.role_id) role_ids.push(req.user.role_id);
        else
            role_ids = req.user.role_ids.split(/\D/).filter(function (val) {
                return val.match(/\d/g);
            });

        // Add button on view
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'user_back_link');
        toolbar.addSaveButton(isAllow(req, 'create'));
        toolbar = toolbar.render();

        app.feature.roles.actions.findAll({
            where: {
                id: {
                    $in: role_ids
                }
            }
        }).then(function (roles) {
            res.backend.render(view_template, {
                item: req.user,
                toolbar: toolbar,
                role_ids: roles
            });
        }).catch(function (err) {
            logger.error(error);
            res.backend.render(view_template, {
                item: req.user,
                toolbar: toolbar,
                role_ids: null
            });
        });
    };

    /**
     * Get Avatar library
     */
    controller.getAvatarGallery = function (req, res) {
        readdirAsync(__base + 'upload/avatar-gallery').then(function (files) {
            res.json(files);
        }).catch(function (err) {
            res.status(500).send(err.stack);
        });
    };

    /**
     * Change pass view
     */
    controller.changePass = function (req, res) {
        // Add button on view
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'user_back_link');
        toolbar = toolbar.render();
        res.backend.render('change-pass', {
            title: "Change User's password",
            item: req.user,
            toolbar: toolbar
        });
    };

    /**
     * Update pass view
     */
    controller.updatePass = function (req, res) {
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'user_back_link');
        toolbar = toolbar.render();
        let old_pass = req.body.old_pass;
        let user_pass = req.body.user_pass;

        app.feature.users.actions.findById(req.user.id).then(function (user) {
            if (user.authenticate(old_pass)) {
                user.updateAttributes({
                    user_pass: user.hashPassword(user_pass)
                }).then(function () {
                    req.flash.success(__('m_users_backend_controllers_index_update_pass_flash_success'));
                }).catch(function (error) {
                    req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                }).finally(function () {
                    res.backend.render('change-pass', {toolbar: toolbar});
                });
            } else {
                req.flash.error(__('m_users_backend_controllers_index_update_pass_flash_error'));
                res.backend.render('change-pass', {toolbar: toolbar});
            }
        });
    };

    controller.userById = function (req, res, next, id) {
        app.feature.users.actions.findWithRole({id: id}).then(function (user) {
            req._user = user;
            next();
        }).catch(function (err) {
            logger.error(err);
            next();
        })
    };

};