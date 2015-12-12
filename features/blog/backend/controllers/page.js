'use strict';

let slug = require('slug');
let logger = require('arrowjs').logger;

module.exports = function (controller, component, app) {

    let isAllow = ArrowHelper.isAllow;
    let itemOfPage = app.getConfig('pagination').numberItem || 10;
    let baseRoute = '/admin/blog/pages/';
    let allPermissions = 'page_manage_all';

    function getErrorMsg(err, oldData, newData) {
        logger.error(err);

        let errorMsg = 'Name: ' + err.name + '<br />' + 'Message: ' + err.message;

        if (err.name == ArrowHelper.UNIQUE_ERROR) {
            for (let i in err.errors) {
                if (oldData && oldData._previousDataValues)
                    newData[err.errors[i].path] = oldData._previousDataValues[err.errors[i].path];
                else
                    newData[err.errors[i].path] = '';
            }

            errorMsg = 'A page with the alias provided already exists';
        }

        return errorMsg;
    }

    controller.pageList = function (req, res) {
        // Get current page and default sorting
        var page = req.params.page || 1;

        // Add buttons and check authorities
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addRefreshButton(baseRoute);
        toolbar.addSearchButton('true');
        toolbar.addCreateButton(isAllow(req, 'page_create'), baseRoute + 'create');
        toolbar.addDeleteButton(isAllow(req, 'page_delete'));
        toolbar = toolbar.render();

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
                link: baseRoute + '{id}',
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

        // Check permissions view all pages
        let customCondition = " AND type='page'";
        if (req.permissions.indexOf(allPermissions) == -1) customCondition += " AND created_by = " + req.user.id;

        let filter = ArrowHelper.createFilter(req, res, tableStructure, {
            rootLink: baseRoute + 'page/$page/sort',
            limit: itemOfPage,
            customCondition: customCondition,
            backLink: 'page_back_link'
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

            // Replace title of no-title page
            let items = results.rows;
            items.map(function (item) {
                if (!item.dataValues.title) item.dataValues.title = '(no title)';
            });

            // Render view
            res.backend.render('page/index', {
                title: __('m_blog_backend_page_render_title'),
                totalPage: totalPage,
                items: items,
                currentPage: page,
                toolbar: toolbar
            });
        }).catch(function (err) {
            logger.error(err);
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);

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

    controller.pageCreate = function (req, res) {
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'post_back_link');
        toolbar.addSaveButton(isAllow(req, 'post_create'));

        res.backend.render('page/new', {
            title: __('m_blog_backend_page_render_create'),
            toolbar: toolbar.render()
        });
    };

    controller.pageSave = function (req, res, next) {
        let data = req.body;
        data.title = data.title.trim();
        data.alias = data.alias || slug(data.title.toLowerCase());
        data.type = 'page';
        data.created_by = req.user.id;
        data.published = data.published || 0;
        if (data.published == 1) {
            if (!data.title) data.title = '(no title)';
            data.published_at = Date.now();
        }

        let oldPage;

        app.models.post.create(data).then(function (page) {
            oldPage = page;
            req.flash.success(__('m_blog_backend_page_flash_create_success'));
            res.redirect(baseRoute + page.id);
        }).catch(function (err) {
            req.flash.error(getErrorMsg(err, oldPage, data));
            res.locals.page = data;
            next();
        });
    };

    controller.pageView = function (req, res) {
        let page = req.post;

        // Recheck permissions to prevent access by url
        if (req.permissions.indexOf(allPermissions) == -1 && page.created_by != req.user.id) {
            req.flash.error("You do not have permission to access");
            return res.redirect('/admin/403');
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'page_back_link');
        toolbar.addSaveButton(isAllow(req, 'page_create'));
        toolbar.addDeleteButton(isAllow(req, 'page_delete'));

        // Add preview button
        toolbar.addGeneralButton(isAllow(req, 'page_index'), 'Preview', baseRoute + 'preview/' + page.id,
            {
                icon: '<i class="fa fa-eye"></i>',
                buttonClass: 'btn btn-info',
                target: '_blank'
            });

        // Render view
        res.backend.render('page/new', {
            title: __('m_blog_backend_page_render_update'),
            page: page,
            toolbar: toolbar.render()
        });
    };

    controller.pageUpdate = function (req, res, next) {
        let page = req.post;

        // Check permissions
        if (req.permissions.indexOf('page_edit_all') == -1 && page.created_by != req.user.id) {
            req.flash.error("You do not have permission to update this page");
            return res.redirect(baseRoute + page.id);
        }

        let data = req.body;
        data.title = data.title.trim();
        data.alias = data.alias || slug(data.title.toLowerCase());
        data.published = data.published || 0;
        if (data.published) {
            if (!data.title) data.title = '(no title)';
            if (data.published != post.published) data.published_at = Date.now();
        }

        page.updateAttributes(data).then(function () {
            req.flash.success(__('m_blog_backend_page_flash_update_success'));
            res.redirect(baseRoute + req.params.postId);
        }).catch(function (err) {
            req.flash.error(getErrorMsg(err, page, data));
            res.locals.page = data;
            next();
        });
    };

    controller.pagePreview = function (req, res) {
        if (req.post) {
            // Render frontend view
            res.frontend.render('page', {
                page: req.page
            });
        } else {
            // Redirect to 404 if post not exist
            res.frontend.render('_404');
        }
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
            res.sendStatus(200);
        }).catch(function (err) {
            logger.error(err);
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);
            res.sendStatus(200);
        });
    };

    /**
     * Return data to create frontend menu (used in menu module)
     */
    controller.linkMenuPage = function (req, res) {
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