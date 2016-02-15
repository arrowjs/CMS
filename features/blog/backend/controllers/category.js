'use strict';

let Promise = require('arrowjs').Promise;
let logger = require('arrowjs').logger;

module.exports = function (controller, component, app) {

    let baseRoute = '/admin/blog/categories/';

    controller.categoryList = function (req, res) {
        let page = req.params.page || 1;
        let itemOfPage = app.getConfig('pagination').numberItem || 10;

        let tableStructure = [
            {
                column: 'id',
                header: '',
                type: 'checkbox',
                width: '1%'
            },
            {
                column: 'name',
                header: __('all_table_column_name'),
                link: baseRoute + '{id}',
                filter: {
                    data_type: 'string'
                },
                width: '25%'
            },
            {
                column: 'alias',
                header: __('all_table_column_alias'),
                filter: {
                    data_type: 'string'
                },
                width: '25%'
            },
            {
                column: 'description',
                header: 'Description',
                filter: {
                    data_type: 'string'
                }
            },
            {
                column: 'count',
                header: 'Count',
                width: '10%',
                filter: {
                    data_type: 'number'
                }
            }
        ];

        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addRefreshButton(baseRoute);
        toolbar.addSearchButton();
        toolbar.addCreateButton(true, baseRoute + 'create');
        toolbar.addDeleteButton();
        toolbar = toolbar.render();

        // Config columns
        let filter = ArrowHelper.createFilter(req, res, tableStructure, {
            rootLink: baseRoute + 'page/$page/sort',
            limit: itemOfPage,
            customCondition: " AND type='post'",
            backLink: 'category_back_link'
        });

        app.feature.category.actions.findAndCountAll({
            where: filter.conditions,
            order: filter.order,
            limit: filter.limit,
            offset: filter.offset
        }).then(function (results) {
            let totalPage = Math.ceil(results.count / itemOfPage);

            res.backend.render('category/index', {
                title: __('m_category_backend_category_render_title'),
                toolbar: toolbar,
                totalPage: totalPage,
                currentPage: page,
                items: results.rows,
                baseRoute: baseRoute,
                queryString: (req.url.indexOf('?') == -1) ? '' : ('?' + req.url.split('?').pop())
            });
        }).catch(function (err) {
            logger.error(err);
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);

            // Render view if has error
            res.backend.render('category/index', {
                title: __('m_category_backend_category_render_title'),
                totalPage: 1,
                items: null,
                currentPage: page,
                queryString: (req.url.indexOf('?') == -1) ? '' : ('?' + req.url.split('?').pop())
            });
        });
    };

    controller.categoryQuickCreate = function (req, res) {
        app.feature.category.actions.create(req.body, 'post').then(function () {
            req.flash.success(__('m_category_backend_category_flash_save_success'));
            res.redirect(baseRoute);
        }).catch(function (err) {
            logger.error(err);

            let errorMsg = 'Name: ' + err.name + '<br />' + 'Message: ' + err.message;

            if (err.name == ArrowHelper.UNIQUE_ERROR) {
                errorMsg = 'A category with the name provided already exists';
            }

            req.flash.error(errorMsg);

            res.redirect(baseRoute);
        });
    };

    controller.categoryCreate = function (req, res) {
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'category_back_link');
        toolbar.addSaveButton();

        res.backend.render('category/new', {
            title: 'New category',
            toolbar: toolbar.render()
        });
    };

    controller.categorySave = function (req, res, next) {
        let data = req.body;

        app.feature.category.actions.create(data, 'post').then(function (category) {
            req.flash.success(__('m_category_backend_category_flash_save_success'));
            res.redirect(baseRoute + category.dataValues.id);
        }).catch(function (err) {
            logger.error(err);

            let errorMsg = 'Name: ' + err.name + '<br />' + 'Message: ' + err.message;

            if (err.name == ArrowHelper.UNIQUE_ERROR) {
                for (let i in err.errors) {
                    data[err.errors[i].path] = '';
                }

                if (err.fields.name)
                    errorMsg = 'A category with the name provided already exists';
                else
                    errorMsg = 'A category with the alias provided already exists';
            }

            req.flash.error(errorMsg);

            res.locals.category = data;
            next();
        });
    };

    controller.categoryView = function (req, res) {
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(req, 'category_back_link');
        toolbar.addSaveButton();

        app.feature.category.actions.findById(req.params.categoryId).then(function (category) {
            res.backend.render('category/new', {
                title: 'Edit category',
                toolbar: toolbar.render(),
                category: category.dataValues
            });
        }).catch(function (err) {
            logger.error(err);
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);
            res.redirect(baseRoute);
        })
    };

    controller.categoryUpdate = function (req, res, next) {
        let categoryId = req.params.categoryId;
        let data = req.body;
        let oldCategory;

        app.feature.category.actions.find({
            where: {
                id: categoryId
            }
        }).then(function (category) {
            oldCategory = category;
            return app.feature.category.actions.update(category, data);
        }).then(function () {
            req.flash.success(__('m_category_backend_category_update_success'));
            res.redirect(baseRoute + categoryId);
        }).catch(function (err) {
            logger.error(err);

            let errorMsg = 'Name: ' + err.name + '<br />' + 'Message: ' + err.message;

            if (err.name == ArrowHelper.UNIQUE_ERROR) {
                for (let i in err.errors) {
                    if (oldCategory && oldCategory._previousDataValues)
                        data[err.errors[i].path] = oldCategory._previousDataValues[err.errors[i].path];
                    else
                        data[err.errors[i].path] = '';
                }

                if (err.fields.name)
                    errorMsg = 'A category with the name provided already exists';
                else
                    errorMsg = 'A category with the alias provided already exists';
            }

            req.flash.error(errorMsg);

            res.locals.category = data;
            next();
        })
    };

    controller.categoryDelete = function (req, res) {
        let listId = req.body.ids.split(',');
        let blogAction = app.feature.blog.actions;

        Promise.all([
            // Update posts have categories was deleted
            Promise.map(listId, function (id) {
                return blogAction.findAndCountAll({
                    where: {
                        categories: {
                            $like: '%:' + id + ':%'
                        }
                    }
                }).then(function (posts) {
                    if (posts.count > 0) {
                        return Promise.map(posts.rows, function (post) {
                            let oldCategory = post.categories;
                            let newCategory = '';

                            // If the post has multiple categories, remove deleted category from string
                            if (oldCategory != (':' + id + ':'))
                                newCategory = oldCategory.replace(':' + id + ':', ':');

                            return blogAction.update(post, {categories: newCategory});
                        });
                    } else {
                        return null;
                    }
                });
            }),
            // Delete categories
            app.feature.category.actions.destroy(listId)
        ]).then(function () {
            req.flash.success(__('m_category_backend_category_flash_delete_success'));
            res.sendStatus(200);
        }).catch(function (err) {
            logger.error(err);
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);
            res.sendStatus(200);
        })
    };

};
