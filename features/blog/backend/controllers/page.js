'use strict';

let _ = require('arrowjs')._;
let Promise = require('arrowjs').Promise;
let logger = require('arrowjs').logger;

module.exports = function (controller, component, app) {

    let baseRoute = '/admin/blog/pages/';
    let permissionManageAll = 'page_manage_all';

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
        let itemOfPage = app.getConfig('pagination').numberItem || 10;

        // Add buttons and check authorities
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addRefreshButton(baseRoute);
        toolbar.addSearchButton();
        toolbar.addCreateButton(true, baseRoute + 'create');
        toolbar.addDeleteButton();
        toolbar = toolbar.render();

        // Config columns
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
                    filter_key: 'user.display_name'
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

        // Check permissions view all pages: If user does not have permission manage all, only show own pages
        let customCondition = " AND type='page'";
        if (req.permissions.indexOf(permissionManageAll) == -1) customCondition += " AND created_by = " + req.user.id;

        let filter = ArrowHelper.createFilter(req, res, tableStructure, {
            rootLink: baseRoute + 'page/$page/sort',
            limit: itemOfPage,
            customCondition: customCondition,
            backLink: 'page_back_link'
        });

        // Find all pages
        app.feature.blog.actions.findAndCountAll({
            where: filter.conditions,
            include: [
                {
                    model: app.models.user,
                    attributes: ['display_name'],
                    where: ['1 = 1']
                }
            ],
            order: filter.order,
            limit: filter.limit,
            offset: (page - 1) * itemOfPage
        }).then(function (results) {
            let totalPage = Math.ceil(results.count / itemOfPage);

            // Replace title of no-title page
            let items = results.rows;
            items.map(function (item) {
                if (!item.title) item.title = '(no title)';
            });

            // Render view
            res.backend.render('page/index', {
                title: __('m_blog_backend_page_render_title'),
                totalPage: totalPage,
                items: items,
                currentPage: page,
                toolbar: toolbar,
                queryString: (req.url.indexOf('?') == -1) ? '' : ('?' + req.url.split('?').pop()),
                baseRoute: baseRoute
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
                toolbar: toolbar,
                queryString: (req.url.indexOf('?') == -1) ? '' : ('?' + req.url.split('?').pop()),
                baseRoute: baseRoute
            });
        });
    };

    controller.pageCreate = function (req, res) {
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'page_back_link');
        toolbar.addSaveButton();

        res.backend.render('page/new', {
            title: __('m_blog_backend_page_render_create'),
            baseRoute: baseRoute,
            toolbar: toolbar.render()
        });
    };

    controller.pageSave = function (req, res, next) {
        let data = req.body;
        let author = req.user.id;
        let blogAction = app.feature.blog.actions;
        let page_id = 0;
        let oldPage;
        let resolve = Promise.resolve();

        if (data.page_id && data.page_id > 0) {
            page_id = data.page_id;

            // Update draft page
            resolve = resolve.then(function () {
                data.modified_by = author;

                return blogAction.findById(page_id).then(function (page) {
                    return blogAction.update(page, data);
                });
            });
        } else {
            // Create page
            resolve = resolve.then(function () {
                data.created_by = author;

                return blogAction.create(data, 'page').then(function (page) {
                    page_id = post.id;
                    oldPage = page;
                    return null;
                });
            });
        }

        resolve.then(function () {
            req.flash.success(__('m_blog_backend_page_flash_create_success'));
            res.redirect(baseRoute + page_id);
        }).catch(function (err) {
            req.flash.error(getErrorMsg(err, oldPage, data));
            res.locals.page = data;
            next();
        });
    };

    controller.pageView = function (req, res) {
        let page = req.page;

        // Check permissions
        if (req.permissions.indexOf(permissionManageAll) == -1 && page.created_by != req.user.id) {
            req.flash.error("You do not have permission to manage this page");
            return res.redirect(baseRoute);
        }

        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'page_back_link');
        toolbar.addSaveButton();
        toolbar.addDeleteButton();

        // Add preview button
        toolbar.addGeneralButton(true, {
            title: '<i class="fa fa-eye"></i> Preview',
            link: baseRoute + 'preview/' + page.id,
            target: '_blank',
            buttonClass: 'btn btn-info'
        });

        // Render view
        res.backend.render('page/new', {
            title: __('m_blog_backend_page_render_update'),
            page: page,
            baseRoute: baseRoute,
            toolbar: toolbar.render()
        });
    };

    controller.pageUpdate = function (req, res, next) {
        let page = req.page;
        let author = req.user.id;

        // Check permissions
        if (req.permissions.indexOf(permissionManageAll) == -1 && page.created_by != author) {
            req.flash.error("You do not have permission to manage this page");
            return res.redirect(baseRoute);
        }

        let data = req.body;
        data.modified_by = author;

        // Update page
        app.feature.blog.actions.update(page, data).then(function () {
            req.flash.success(__('m_blog_backend_page_flash_update_success'));
            res.redirect(baseRoute + page.id);
        }).catch(function (err) {
            req.flash.error(getErrorMsg(err, page, data));
            res.locals.page = data;
            next();
        });
    };

    controller.pagePreview = function (req, res) {
        if (req.page) {
            // Check permissions
            if (req.permissions.indexOf(permissionManageAll) == -1 && req.page.created_by != req.user.id) {
                req.flash.error("You do not have permission to view this page");
                return res.redirect(baseRoute);
            }

            // Render frontend view
            res.frontend.render('page', {
                page: req.page
            });
        } else {
            // Redirect to 404 if page not exist
            res.frontend.render('_404');
        }
    };

    controller.pageAutosave = function (req, res) {
        let data = req.body;
        let author = req.user.id;

        if (data.page_id) {
            app.feature.blog.actions.findById(data.page_id).then(function (page) {
                // Recheck permissions to prevent user access by ajax
                if (req.permissions.indexOf(permissionManageAll) == -1 && page.created_by != author) {
                    return res.jsonp({id: 0});
                }

                data.modified_by = author;

                // Update page
                app.feature.blog.actions.update(page, data).then(function () {
                    res.jsonp({id: page.id});
                }).catch(function (err) {
                    logger.error(err);
                    res.jsonp({id: 0});
                });
            })
        } else {
            data.created_by = author;

            // Create page
            app.feature.blog.actions.create(data, 'page').then(function (page) {
                if (page && page.id)
                    res.jsonp({id: page.id});
                else
                    res.jsonp({id: 0});
            }).catch(function (err) {
                logger.error(err);
                res.jsonp({id: 0});
            })
        }
    };

    controller.pageDelete = function (req, res) {
        let ids = req.body.ids.split(',');
        let blogAction = app.feature.blog.actions;

        // Find page need to delete
        blogAction.findAll({
            where: {
                id: {
                    $in: ids
                }
            }
        }).then(function (pages) {
            return Promise.map(pages, function (page) {
                // Recheck permissions to prevent user access by ajax
                if (req.permissions.indexOf(permissionManageAll) == -1 && page.created_by != req.user.id) {
                    return null;
                } else {
                    return blogAction.destroy([page.id]);
                }
            });
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
        let itemOfPage = app.getConfig('pagination').numberItem || 10;

        let conditions = "type='page' AND published = 1";
        if (searchText != '') conditions += " AND title like '%" + searchText.toLowerCase() + "%'";

        // Find all pages with page and search keyword
        app.feature.blog.actions.findAndCountAll({
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
                link_template: '/{alias}'
            });
        });
    }

};