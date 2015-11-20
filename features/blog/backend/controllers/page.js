'use strict';
let slug = require('slug');
let promise = require('bluebird');
let formidable = require('formidable');
promise.promisifyAll(formidable);

let route = 'blog';

module.exports = function (controller, component, app) {

    controller.pagelist = function (req, res) {

        res.locals.user = req.user;

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addCreateButton(true, '/admin/blog/pages/create');
        toolbar.addDeleteButton(true);
        toolbar = toolbar.render();


        // Get current page and default sorting
        let page = req.params.page || 1;
        let column = req.params.sort || 'created_by';
        let order = req.params.order || 'desc';
        res.locals.root_link = '/admin/blog/pages/page/' + page + '/sort';

        // Store search data to session
        let session_search = {};
        if (req.session.search) {
            session_search = req.session.search;
        }
        session_search[route + '_page_list'] = req.url;
        req.session.search = session_search;


        let tableStructure = [
            {
                column: "id",
                width: '1%',
                header: "",
                type: 'checkbox'
            },
            {
                column: 'title',
                width: '25%',
                header: __('all_table_column_title'),
                link: '/admin/blog/pages/{id}',
                acl: 'blog.post_edit',
                filter: {
                    data_type: 'string'
                }
            },
            {
                column: 'alias',
                width: '25%',
                header: __('all_table_column_alias'),
                filter: {
                    data_type: 'string'
                }
            },
            {
                column: 'user.display_name',
                width: '20%',
                header: __('all_table_column_author'),
                filter: {
                    data_type: 'string',
                    filter_key: 'created_by'
                }
            },
            {
                column: 'created_at',
                width: '15%',
                header: __('m_blog_backend_page_filter_column_created_date'),
                type: 'datetime',
                filter: {
                    data_type: 'datetime',
                    filter_key: 'created_at'
                }
            },
            {
                column: 'published',
                width: '10%',
                header: __('all_table_column_status'),
                type: 'custom',
                alias: {
                    "1": "Publish",
                    "0": "Draft"
                },
                filter: {
                    type: 'select',
                    filter_key: 'published',
                    data_source: [
                        {
                            name: 'Publish',
                            value: 1
                        },
                        {
                            name: 'Draft',
                            value: 0
                        }
                    ],
                    display_key: 'name',
                    value_key: 'value'
                }
            }
        ];

        let itemOfPage = app.getConfig('pagination').numberItem || 10;

        let filter = ArrowHelper.createFilter(req, res, tableStructure, {
            rootLink: '/admin/blog/pages',
            limit: itemOfPage,
            customCondition: " AND type='page' "
        });


        // List pages
        app.models.post.findAndCountAll({
            include: [
                {
                    model: app.models.user, attributes: ['display_name'],
                    where: ['1 = 1']
                }
            ],
            where: filter.conditions,
            limit: itemOfPage,
            offset: (page - 1) * itemOfPage
        }).then(function (results) {
            let totalPage = Math.ceil(results.count / itemOfPage);
            // Render view
            res.backend.render('page/index', {
                title: __('m_blog_backend_page_render_title'),
                totalPage: totalPage,
                items: results.rows,
                currentPage: page,
                toolbar: toolbar
            });

        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

            // Render view if has error
            res.backend.render('page/index', {
                title: __('m_blog_backend_page_render_title'),
                totalPage: 1,
                items: null,
                currentPage: page,
                toolbar: toolbar
            });
        });

    };

    controller.pagedelete = function (req, res) {

        res.locals.user = req.user;
        app.models.post.destroy({
            where: {
                id: {
                    "in": req.body.ids.split(',')
                }
            }
        }).then(function () {
            req.flash.success(__('m_blog_backend_page_flash_delete_success'));
            res.send(200);
        });
    };

    controller.pagecreate = function (req, res) {

        res.locals.user = req.user;
        // Add button
        let back_link = '/blog/pages/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_page_list']) {
            back_link = '/admin' + search_params[route + '_page_list'];
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(true);
        toolbar = toolbar.render();


        app.models.user.findAll({
            order: "id asc"
        }).then(function (results) {
            res.backend.render('page/new', {
                title: __('m_blog_backend_page_render_create'),
                users: results,
                toolbar: toolbar
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
        });
    };

    controller.pagesave = function (req, res) {

        res.locals.user = req.user;
        // Add button
        let back_link = '/admin/blog/pages/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_page_list']) {
            back_link = '/admin' + search_params[route + '_page_list'];
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(true);
        toolbar.addDeleteButton(true);
        toolbar = toolbar.render();


        let data = req.body;
        //console.log("========", slug(data.title).toLowerCase());
        if (data.alias == null || data.alias == '')
            data.alias = slug(data.title).toLowerCase();
        data.created_by = req.user.id;
        data.type = 'page';
        if (!data.published) data.published = 0;

        app.models.post.create(data).then(function (page) {
            req.flash.success(__('m_blog_backend_page_flash_create_success'));
            res.redirect('/admin/blog/pages/' + page.id);
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
        });
    };

    controller.pageview = function (req, res) {

        res.locals.user = req.user;
        // Add button
        let back_link = '/admin/blog/pages/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_page_list']) {
            back_link = '/admin' + search_params[route + '_page_list'];
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(true);
        toolbar.addDeleteButton(true);
        toolbar = toolbar.render();


        promise.all([
            app.models.user.findAll({
                order: "id asc"
            }),
            app.models.post.find({
                include: [app.models.user],
                where: {
                    id: req.params.cid,
                    type: 'page'
                }
            })
        ]).then(function (results) {
            res.locals.viewButton = results[1].alias;
            res.backend.render('page/new', {
                title: __('m_blog_backend_page_render_update'),
                users: results[0],
                page: results[1],
                toolbar: toolbar
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
        });
    };

    controller.redirectToView = function (req, res) {

        res.locals.user = req.user;

        app.models.post.find({
            where: {
                alias: req.params.name
            }
        }).then(function (page) {
            res.redirect('/admin/blog/pages/' + page.id);
        }).catch(function (err) {
            res.redirect('/404.html');
        })
    };

    controller.pageupdate = function (req, res) {

        res.locals.user = req.user;

        // Add button
        let back_link = '/admin/blog/pages/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_page_list']) {
            back_link = '/admin' + search_params[route + '_page_list'];
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(true);
        toolbar.addDeleteButton(true);
        toolbar = toolbar.render();


        let data = req.body;
        if (!data.published) data.published = 0;
        data.modified_date = data.modified_date_gmt = Date.now();

        app.models.post.find({
            include: [app.models.user],
            where: {
                id: req.params.cid
            }
        }).then(function (page) {
            page.updateAttributes(data).then(function () {
                res.locals.viewButton = page.alias;
                req.messages = req.flash.success(__('m_blog_backend_page_flash_update_success'));
                res.backend.render('page/new', {
                    title: __('m_blog_backend_page_render_update'),
                    page: page,
                    toolbar : toolbar
                });
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
        });
    };
};