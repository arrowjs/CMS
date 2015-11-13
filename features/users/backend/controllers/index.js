'use strict';

let _ = require('lodash');
let fs = require('fs');
let redis = require('redis').createClient();
let path = require('path');
let slug = require('slug');
let promise = require('bluebird');
let writeFileAsync = promise.promisify(require('fs').writeFile);
let readdirAsync = promise.promisify(require('fs').readdir);
let formidable = require('formidable');
promise.promisifyAll(formidable);

let edit_template = 'new.twig';
let folder_upload = '/img/users/';
let route = 'users';

module.exports = function (controller,component,app) {

    let config = app.getConfig;
    controller.list = function (req, res) {
        // Add button
        //res.locals.createButton = __acl.addButton(req, route, 'create', '/admin/users/create');

        // Config ordering
        //let page = req.params.page || 1;
        //let column = req.params.sort || 'id';
        //let order = req.params.order || 'asc';
        //res.locals.root_link = '/admin/users/page/' + page + '/sort';

        // Store search data to session
        //let session_search = {};
        //if (req.session.search) {
        //    session_search = req.session.search;
        //}
        //session_search[route + '_index_list'] = req.url;
        //req.session.search = session_search;

        // Config columns
        //let filter = createFilter(req, res, route, '/admin/users', column, order, [
        //    {
        //        column: "id",
        //        width: '8%',
        //        header: "ID",
        //        filter: {
        //            model: 'user',
        //            data_type: 'number'
        //        }
        //    },
        //    {
        //        column: "display_name",
        //        width: '15%',
        //        header: t('m_users_backend_full_name'),
        //        link: '/admin/users/{id}',
        //        acl: 'users.update',
        //        filter: {
        //            data_type: 'string'
        //        }
        //    },
        //    {
        //        column: "user_login",
        //        width: '15%',
        //        header: t('m_users_backend_user_name'),
        //        filter: {
        //            data_type: 'string'
        //        }
        //    },
        //    {
        //        column: "user_email",
        //        width: '15%',
        //        header: t('all_table_column_email'),
        //        filter: {
        //            data_type: 'string'
        //        }
        //    },
        //    {
        //        column: "phone",
        //        width: '12%',
        //        header: t('all_table_column_phone'),
        //        filter: {
        //            data_type: 'string'
        //        }
        //    },
        //    {
        //        column: "role.name",
        //        width: '10%',
        //        header: t('all_table_column_role'),
        //        link: '/admin/roles/{role.id}',
        //        filter: {
        //            type: 'select',
        //            filter_key: 'role_id',
        //            data_source: 'arr_role',
        //            display_key: 'name',
        //            value_key: 'id'
        //        }
        //    },
        //    {
        //        column: "user_status",
        //        width: '10%',
        //        header: t('all_table_column_status'),
        //        filter: {
        //            type: 'select',
        //            filter_key: 'user_status',
        //            data_source: [
        //                {
        //                    name: "publish"
        //                },
        //                {
        //                    name: "un-publish"
        //                }
        //            ],
        //            display_key: 'name',
        //            value_key: 'name'
        //        }
        //    }
        //]);

        // List users
        app.models.user.findAndCountAll({
            //attributes: filter.attributes,
            //include: [
            //    {
            //        model: app.models.role
            //    }
            //]//,
            //order: filter.sort,
            //limit: config.pagination.number_item,
            //offset: (page - 1) * config.pagination.number_item,
            //where: filter.values
        }).then(function (results) {
            //let totalPage = Math.ceil(results.count / config.pagination.number_item);
            res.backend.render(req, res, 'index', {
                title: t('m_users_backend_controllers_index_list'),
                totalPage: totalPage,
                items: results.rows,
                currentPage: page

            });

        }).catch(function (error) {
            //req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.backend.render('index', {
                title: t('m_users_backend_controllers_index_list'),
                totalPage: 1,
                users: null,
                currentPage: 1
            });
        });
    };

    controller.view = function (req, res) {
        // Add button
        let back_link = '/admin/users';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_index_list']) {
            back_link = '/admin' + search_params[route + '_index_list'];
        }
        //res.locals.backButton = __acl.addButton(req, route, 'index', back_link);
        //res.locals.saveButton = __acl.addButton(req, route, 'create');

        // Get user by session and list roles
        //app.models.role.findAll().then(function (roles) {
        //    res.backend.render(req, res, edit_template, {
        //        title: t('m_users_backend_controllers_index_update'),
        //        roles: roles,
        //        user: req._user,
        //        id: req.params.uid
        //    });
        //}).catch(function (error) {
        //    req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        //    res.backend.render(req, res, edit_template, {
        //        title: t('m_users_backend_controllers_index_update'),
        //        roles: null,
        //        users: null,
        //        id: 0
        //    });
        //});
        res.backend.render("new");
    };

    controller.course_of = function (req, res) {
        let email = req.params.email;
        app.models.customer_register.findAll({
            include: [{
                model: app.models.course, attributes: [
                    'title'
                ]
            }],
            where: {
                email: email
            },
            attributes: ['full_name', 'email', 'register_date']
        }).then(function (results) {
            res.json(results);
        }).catch(function (err) {
            req.flash.error("Error: ", err.stack);
        })
    };

    controller.update = function (req, res, next) {
        let edit_user = null;
        let data = req.body;
        // Get user by id
        //console.log('update',JSON.stringify(config('redis_prefix'),null,3));
        app.models.user.findById(req.params.uid).then(function (user) {
            edit_user = user;
            return new Promise(function (fulfill, reject) {
                if (data.base64 && data.base64 != '' && data.base64 != user.user_image_url) {
                    let fileName = folder_upload + slug(user.user_login).toLowerCase() + '.png';
                    let base64Data = data.base64.replace(/^data:image\/png;base64,/, "");

                    return writeFileAsync(__base + 'public' + fileName, base64Data, 'base64').then(function () {
                        data.user_image_url = fileName;
                        fulfill(data);
                    }).catch(function (err) {
                        reject(err);
                    });
                } else fulfill(data);
            })
        }).then(function (data) {
            return edit_user.updateAttributes(data).then(function (result) {
                req.flash.success(t('m_users_backend_controllers_index_update_flash_success'));

                if (req.url.indexOf('profile') !== -1) {
                    redis.del(req.user.key, function (err, reply) {
                        if (!err)
                            app.models.user.find({
                                include: [app.models.role],
                                where: {
                                    id: result.id
                                }
                            }).then(function (user) {
                                let user_tmp = JSON.parse(JSON.stringify(user));
                                user_tmp.key = config('redis_prefix') + 'current-user-' + user.id;
                                user_tmp.acl = JSON.parse(user_tmp.role.rules);
                                redis.setex(user_tmp.key, 300, JSON.stringify(user_tmp));
                            }).catch(function (error) {
                                console.log(error.stack);
                            });
                    });
                    return res.redirect('/' + config('admin_prefix') + '/users/profile/' + req.params.uid);
                }
                return res.redirect('/' + config('admin_prefix') + '/users/' + req.params.uid);
            });
        }).catch(function (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                req.flash.error(t('m_users_backend_controllers_index_flash_email_exist'));
                return next();
            } else {
                req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                return next();
            }
        });
    };

    controller.create = function (req, res) {
        // Add button
        let back_link = '/admin/users';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_index_list']) {
            back_link = '/admin' + search_params[route + '_index_list'];
        }
        //res.locals.backButton = __acl.addButton(req, route, 'index', back_link);
        //res.locals.saveButton = __acl.addButton(req, route, 'create');

        // Get list roles
        //app.models.role.findAll({
        //    order: "id asc"
        //}).then(function (roles) {
        //    res.backend.render(req, res, edit_template, {
        //        title: t('m_users_backend_controllers_index_add_user'),
        //        roles: roles
        //    });
        //}).catch(function (error) {
        //    req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        //    res.backend.render(req, res, edit_template, {
        //        title: t('m_users_backend_controllers_index_add_user'),
        //        roles: null
        //    });
        //});
        res.backend.render('new');
    };

    controller.save = function (req, res, next) {
        let back_link = '/admin/users';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_index_list']) {
            back_link = '/admin' + search_params[route + '_index_list'];
        }

        // Get form data
        var data = req.body;
        return new Promise(function (fulfill, reject) {
            if (data.base64 && data.base64 != '') {
                let fileName = folder_upload + slug(data.user_login).toLowerCase() + '.png';
                let base64Data = data.base64.replace(/^data:image\/png;base64,/, "");

                return writeFileAsync(__base + 'public' + fileName, base64Data, 'base64').then(function () {
                    data.user_image_url = fileName;
                    fulfill(data);
                }).catch(function (err) {
                    reject(err);
                });
            } else fulfill(data);
        }).then(function (data) {
                app.models.user.create(data).then(function (user) {
                    req.flash.success(t('m_users_backend_controllers_index_add_flash_success'));
                    res.redirect(back_link);
                }).catch(function (error) {
                    if (error.name == 'SequelizeUniqueConstraintError') {
                        req.flash.error(t('m_users_backend_controllers_index_flash_email_exist'));
                        res.redirect(back_link);
                    } else {
                        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                        res.redirect(back_link);
                    }
                });
            }).catch(function (error) {
                req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                res.redirect(back_link);
            })
    };

    controller.delete = function (req, res) {
        // Check delete current user
        let ids = req.body.ids;
        let id = req.user.id;
        let index = ids.indexOf(id);

        // Delete user
        if (index == -1) {
            app.models.user.destroy({
                where: {
                    id: {
                        "in": ids.split(',')
                    }
                }
            }).then(function () {
                req.flash.success(t('m_users_backend_controllers_index_delete_flash_success'));
                res.sendStatus(204);
            }).catch(function (error) {
                req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                res.sendStatus(200);
            });
        } else {
            req.flash.warning(t('m_users_backend_controllers_index_delete_flash_success'));
            res.sendStatus(200);
        }
    };
    /**
     * Profile
     */
    controller.profile = function (req, res) {
        // Add button
        //console.log('profile : ',JSON.stringify(req.user,null,3));
        let role_ids = [];
        if(!req.user.role_ids) role_ids.push(req.user.role_id);
        else role_ids = req.user.role_ids.split(/\D/);
        app.models.role.findAll({
            where :{
                id : {
                    $in : role_ids
                }
            }
        }).then(function (roles) {
            //console.log(JSON.stringify(roles,null,2));
            res.locals.backButton = '/admin'
            res.locals.saveButton = 'save';
            res.backend.render('new', {
                user: req.user,
                role_ids: roles
            });
        })


        //app.models.user.find({
        //    include: [
        //        {
        //            model: app.models.role
        //        }
        //    ],
        //    where: {
        //        id: req.user.id
        //    }
        //}).then(function (user) {
        //    let role_ids = [];
        //    if(!req.user.role_ids) role_ids.push(req.user.role_id);
        //    else role_ids = req.user.role_ids;
        //
        //})

        //console.log('profile : '+JSON.stringify(req.user));
        //app.models.role.findAll({
        //    where: {
        //        id: {
        //            $in: role_ids
        //        }
        //    },
        //    raw: true
        //}).then(function (results) {
        //    //res.locals.saveButton = __acl.addButton(req, route, 'update_profile');
        //    res.backend.render(req, res, 'new.twig', {
        //        user: req._user,
        //        role_ids: results
        //    });
        //}).catch(function (err) {
        //    res.status(500).send(err.stack);
        //})

    };
    /**
     * Get Avatar library
     */
    controller.getAvatarGallery = function (req, res) {
        readdirAsync(__base + 'public/avatar-gallery').then(function (files) {
            res.json(files);
        }).catch(function (err) {
            res.status(500).send(err.stack);
        })
    };

    /**
     * Change pass view
     */
    controller.changePass = function (req, res) {
        res.backend.render(req, res, 'change-pass', {
            user: req.user
        });
    };

    /**
     * Update pass view
     */
    controller.updatePass = function (req, res) {
        let old_pass = req.body.old_pass;
        let user_pass = req.body.user_pass;

        app.models.user.findById(req.user.id).then(function (user) {
            if (user.authenticate(old_pass)) {
                user.updateAttributes({
                    user_pass: user.hashPassword(user_pass)
                }).then(function () {
                    req.flash.success(t('m_users_backend_controllers_index_update_pass_flash_success'));
                }).catch(function (error) {
                    req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                }).finally(function () {
                    res.backend.render(req, res, 'change-pass');
                });
            } else {
                req.flash.warning(t('m_users_backend_controllers_index_update_pass_flash_error'));
                res.backend.render(req, res, 'change-pass');
            }
        });
    };

    controller.saveOAuthUserProfile = function (req, profile, done) {
        app.models.user.find({
            where: {
                user_email: profile.user_email
            }
        }).then(function (user) {
            if (user) {
                return done(null, user);
            } else {
                app.models.user.create(profile).then(function (user) {
                    return done(null, user);
                })
            }
        })
    };

    controller.userById = function (req, res, next, id) {
        console.log("userById called by param")
        app.models.user.find({
            include: [
                {
                    model: app.models.role
                }
            ],
            where: {
                id: id
            },
            raw : true
        }).then(function (user) {
            req._user = user;
            next();
        }).catch(function (err) {
            console.log(err);
        })
    };

    controller.hasAuthorization = function (req, res, next) {
        if (req._user.id !== req.user.id) {
            return false;
        }
        return true;
    };

}