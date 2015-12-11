'use strict';

let slug = require('slug');
let _ = require('arrowjs')._;
let Promise = require('arrowjs').Promise;

let route = 'blog';
let logger = require('arrowjs').logger;

module.exports = function (controller, component, app) {

    let itemOfPage = app.getConfig('pagination').numberItem || 10;
    let isAllow = ArrowHelper.isAllow;
    let baseRoute = '/admin/blog/posts/';

    function convertCategoriesStringToArray(str) {
        str = str.split(':');
        str.shift();
        str.pop(str.length - 1);
        return str;
    }

    controller.postList = function (req, res) {
        // Get current page and default sorting
        var page = req.params.page || 1;

        // Add buttons and check authorities
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addRefreshButton(baseRoute);
        toolbar.addSearchButton('true');
        toolbar.addCreateButton(isAllow(req, 'post_create'), baseRoute + 'create');
        toolbar.addDeleteButton(isAllow(req, 'post_delete'));
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

        let filter = ArrowHelper.createFilter(req, res, tableStructure, {
            rootLink: baseRoute + 'page/$page/sort',
            limit: itemOfPage,
            customCondition: "AND type='post'",
            backLink: 'post_back_link'
        });

        // Find all posts
        app.models.post.findAndCountAll({
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

            // Render view
            res.backend.render('post/index', {
                title: __('m_blog_backend_post_render_title'),
                totalPage: totalPage,
                items: results.rows,
                currentPage: page,
                toolbar: toolbar
            });
        }).catch(function (err) {
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);

            // Render view if has error
            res.backend.render('post/index', {
                title: __('m_blog_backend_post_render_title'),
                totalPage: 1,
                items: null,
                currentPage: page,
                toolbar: toolbar
            });
        });
    };

    controller.postCreate = function (req, res) {
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton('post_back_link');
        toolbar.addSaveButton(isAllow(req, 'post_create'));

        app.feature.category.actions.findAll({
            where: {
                type: 'post'
            },
            order: 'name ASC'
        }).then(function (results) {
            res.backend.render('post/new', {
                title: __('m_blog_backend_post_render_create'),
                categories: results,
                toolbar: toolbar.render()
            });
        }).catch(function (err) {
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);
            res.redirect(baseRoute);
        });
    };

    controller.postSave = function (req, res, next) {
        let data = req.body;
        data.title = data.title.trim();
        data.created_by = req.user.id;
        if (!data.alias) data.alias = slug(data.title.toLowerCase());
        data.type = 'post';
        if (!data.published) data.published = 0;
        if (data.published == 1) data.published_at = Date.now();

        let post_id = 0;
        let oldPost;

        app.models.post.create(data).then(function (post) {
            post_id = post.id;
            oldPost = post;

            let categories = post.categories;

            if (categories) {
                convertCategoriesStringToArray(categories);

                // Update count of categories
                return Promise.map(categories, function (id) {
                    return app.feature.category.actions.findById(id).then(function (category) {
                        if (category) {
                            let count = +category.count + 1;
                            return app.feature.category.actions.update(category, {
                                count: count
                            });
                        }
                    });
                });
            }
        }).then(function () {
            req.flash.success(__('m_blog_backend_post_flash_create_success'));
            res.redirect(baseRoute + post_id);
        }).catch(function (err) {
            logger.error(err);

            let errorMsg = 'Name: ' + err.name + '<br />' + 'Message: ' + err.message;

            if (err.name == 'SequelizeUniqueConstraintError') {
                for (let i in err.errors) {
                    if (oldPost && oldPost._previousDataValues)
                        data[err.errors[i].path] = oldPost._previousDataValues[err.errors[i].path];
                    else
                        data[err.errors[i].path] = '';
                }

                errorMsg = 'A post with the alias provided already exists';
            }

            req.flash.error(errorMsg);

            res.locals.category = data;
            next();
        });
    };

    controller.postView = function (req, res) {
        // Add buttons
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton('post_back_link');
        toolbar.addSaveButton(isAllow(req, 'post_create'));
        toolbar.addDeleteButton(isAllow(req, 'post_delete'));

        app.feature.category.actions.findAll({
            where: {
                type: 'post'
            },
            order: 'id ASC'
        }).then(function (results) {
            // Add preview button
            toolbar.addGeneralButton(isAllow(req, 'post_index'), 'Preview', baseRoute + 'preview/' + req.post.id,
                {
                    icon: '<i class="fa fa-eye"></i>',
                    buttonClass: 'btn btn-info',
                    target: '_blank'
                });

            res.backend.render('post/new', {
                title: __('m_blog_backend_post_render_update'),
                categories: results[0],
                post: req.post,
                toolbar: toolbar.render()
            });
        }).catch(function (err) {
            logger.error(err);
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);
            res.redirect(baseRoute);
        });
    };

    controller.postUpdate = function (req, res, next) {
        // Add button
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton('post_back_link');

        let data = req.body;
        data.title = data.title.trim();
        if (!data.alias) data.alias = slug(data.title.toLowerCase());
        data.categories = data.categories || '';
        data.author_visible = (data.author_visible != null);
        if (!data.published) data.published = 0;

        let post = req.post;

        let categories = post.categories;
        if (categories)
            convertCategoriesStringToArray(categories);
        else
            categories = [];

        let newCategories = data.categories;
        if (newCategories)
            convertCategoriesStringToArray(newCategories);
        else
            newCategories = [];

        // Update count for category
        let decreaseCount = [],
            increaseCount = [];

        if (Array.isArray(categories) && Array.isArray(newCategories)) {
            decreaseCount = categories.filter(function (current) {
                return newCategories.filter(function (current_b) {
                        return current_b == current
                    }).length == 0
            });
            increaseCount = newCategories.filter(function (current) {
                return categories.filter(function (current_a) {
                        return current_a == current
                    }).length == 0
            });
        }

        if (data.published != post.published && data.published == 1) data.published_at = Date.now();

        return post.updateAttributes(data).then(function (result) {
            return Promise.all([
                Promise.map(decreaseCount, function (id) {
                    return app.feature.category.actions.findById(id)
                        .then(function (category) {
                            if (category) {
                                let count = +category.count - 1;
                                return app.feature.category.actions.updateAttributes(category, {
                                    count: count
                                });
                            }
                        });
                }),
                Promise.map(increaseCount, function (id) {
                    return app.feature.category.actions.findById(id)
                        .then(function (category) {
                            if (category) {
                                let count = +category.count + 1;
                                return app.feature.category.actions.updateAttributes(category, {
                                    count: count
                                });
                            }
                        });
                })
            ])
        }).then(function () {
            req.flash.success(__('m_blog_backend_post_flash_update_success'));
            res.redirect(baseRoute + req.params.cid);
        }).catch(function (err) {
            logger.error(err);

            let errorMsg = 'Name: ' + err.name + '<br />' + 'Message: ' + err.message;

            if (err.name == 'SequelizeUniqueConstraintError') {
                for (let i in err.errors) {
                    if (oldPost && oldPost._previousDataValues)
                        data[err.errors[i].path] = oldPost._previousDataValues[err.errors[i].path];
                    else
                        data[err.errors[i].path] = '';
                }

                errorMsg = 'A post with the alias provided already exists';
            }

            req.flash.error(errorMsg);

            res.locals.category = data;
            next();
        });
    };

    controller.postDelete = function (req, res) {
        app.models.post.findAll({
            where: {
                id: {
                    $in: req.body.ids.split(',')
                }
            }
        }).then(function (posts) {
            Promise.map(posts, function (post) {
                let categories = post.categories;
                if (categories != null && categories != '') {
                    categories = categories.split(':');
                    categories.shift();
                    categories.pop(categories.length - 1);
                    if (categories.length > 0) {
                        categories.forEach(function (id) {
                            app.feature.category.actions.findById(id).then(function () {
                                let count = +cat.count - 1;
                                cat.updateAttributes({
                                    count: count
                                });
                            })
                        });
                    }
                }

                return app.models.post.destroy({
                    where: {
                        id: post.id
                    }
                }).catch(function (err) {
                    req.flash.error('Post id: ' + post.id + ' | ' + err.name + ' : ' + err.message);
                });
            });
        }).then(function () {
            req.flash.success(__('m_blog_backend_post_flash_delete_success'));
            res.sendStatus(200);
        }).catch(function (err) {
            logger.error(err);
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);
            res.sendStatus(200);
        });
    };

    controller.postRead = function (req, res, next, id) {
        app.models.post.findById(id).then(function (post) {
            req.post = post;
            next();
        });
    };

    controller.hasAuthorization = function (req, res, next) {
        return next((req.post.created_by !== req.user.id));
    };

    controller.postPreview = function (req, res) {
        let postId = req.params.postId;

        app.models.post.find({
            where: {
                id: postId,
                type: 'post'
            },
            raw: true
        }).then(function (post) {
            if (post) {
                // Render view
                res.frontend.render('post', {
                    post: post
                });
            } else {
                // Redirect to 404 if post not exist
                res.frontend.render('_404');
            }
        });
    };

    /*
     * function to display all post which is choosed by user when create menus
     * return : json object contain
     totalRows: totalRows //number of posts
     totalPage: totalPage //number of page to display
     items: items //posts to display
     title_column: 'title',//title of column to display
     link_template: '/admin/blog/{id}/{alias}' //link of post add to menu
     * */
    controller.link_menu_post = function (req, res) {
        let page = req.query.page;
        let searchText = req.query.searchStr;

        let conditions = "type='post' AND published = 1";
        if (searchText != '') conditions += " AND title like '%" + searchText.toLowerCase() + "%'";

        // Find all posts with page and search keyword
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
                link_template: '/blog/posts/{id}/{alias}'
            });
        });
    }
};