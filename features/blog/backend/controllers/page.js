'use strict';

let slug = require('slug');
let promise = require('arrowjs').Promise;

let route = 'blog';

module.exports = function (controller, component, app) {

    let isAllow = ArrowHelper.isAllow;
    let itemOfPage = app.getConfig('pagination').numberItem || 10;

    controller.pageList = function (req, res) {

        var page = req.params.page || 1;
        // Add buttons and check authorities
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addCreateButton(isAllow(req, 'page_create'), '/admin/blog/pages/create');
        toolbar.addDeleteButton(isAllow(req, 'page_delete'));
        toolbar = toolbar.render();

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

        let filter = ArrowHelper.createFilter(req, res, tableStructure, {
            rootLink: '/admin/blog/pages/page/$page/sort',
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
            order: filter.order,
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

    controller.pageDelete = function (req, res) {
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

    controller.pageCreate = function (req, res) {
        // Add button
        let back_link = '/blog/pages/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_page_list']) {
            back_link = '/admin' + search_params[route + '_page_list'];
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(isAllow(req, 'page_create'));
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

    controller.pageSave = function (req, res, next) {
        // Add button
        let back_link = '/admin/blog/pages/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_page_list']) {
            back_link = '/admin' + search_params[route + '_page_list'];
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(isAllow(req, 'page_create'));
        toolbar.addDeleteButton(isAllow(req, 'page_delete'));

        let data = req.body;
        data.title = data.title.trim();
        if (data.alias == null || data.alias == '')
            data.alias = slug(data.title).toLowerCase();
        data.created_by = req.user.id;
        data.type = 'page';
        if (!data.published) data.published = 0;

        app.models.post.create(data).then(function (page) {
            req.flash.success(__('m_blog_backend_page_flash_create_success'));
            res.locals.toolbar = toolbar.render();
            res.redirect('/admin/blog/pages/' + page.id);
        }).catch(function (err) {
            let messageError ='' ;
            if(err.name == 'SequelizeValidationError'){
                err.errors.map(function (e) {
                    if(e)
                    messageError += e.message+'<br />';
                })
            }else{
                messageError = 'Name: ' + err.name + '<br />' + 'Message: ' + err.message;
            }
            req.flash.error(messageError);
            res.locals.page = data,
            next();
        });
    };

    controller.pageView = function (req, res) {
        // Add button
        let back_link = '/admin/blog/pages/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_page_list']) {
            back_link = '/admin' + search_params[route + '_page_list'];
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(isAllow(req, 'page_create'));
        toolbar.addDeleteButton(isAllow(req, 'page_delete'));
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
        app.models.post.find({
            where: {
                alias: req.params.name
            }
        }).then(function (page) {
            res.redirect('/admin/blog/pages/' + page.id);
        }).catch(function (err) {
            res.backend.render('_404');
        })
    };
    // todo: not yet check data when user update successfully or unsuccessfully
    controller.pageUpdate = function (req, res) {
        let back_link = '/admin/blog/pages/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_page_list']) {
            back_link = '/admin' + search_params[route + '_page_list'];
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(isAllow(req, 'page_create'));
        toolbar.addDeleteButton(isAllow(req, 'page_delete'));
        toolbar = toolbar.render();

        let data = req.body;
        // check data title and alias
        data.title = data.title.trim();
        if (data.alias == null || data.alias == '')
            data.alias = slug(data.title).toLowerCase();
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
                    toolbar: toolbar
                });
            }).catch(function (error) {
                req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
                res.redirect(back_link);
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
        });
    };

    controller.link_menu_page = function (req, res) {
        let page = req.query.page;
        let searchText = req.query.searchStr;

        let conditions = "type='page' AND published = 1";
        if (searchText != '') conditions += " AND title ilike '%" + searchText + "%'";

        // Find all page with page and search keyword
        app.models.post.findAndCount({
            attributes: ['id', 'alias', 'title'],
            where: [conditions],
            limit: itemOfPage,
            offset: (page - 1) * itemOfPage,
            raw: true
        }).then(function (results) {
            let totalRows = results.count;
            let items = results.rows;
            let totalPage = Math.ceil(results.count / itemOfPage);

            // Send json response
            res.jsonp({
                totalRows: totalRows,
                totalPage: totalPage,
                items: items,
                title_column: 'title',
                link_template: '/blog/{alias}'
            });
        });
    };

};