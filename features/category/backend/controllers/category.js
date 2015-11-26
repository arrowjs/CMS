'use strict';

let slug = require('slug');
let promise = require('arrowjs').Promise;
let logger = require('arrowjs').logger;

module.exports = function (controller, component, app) {
    let isAllow = ArrowHelper.isAllow;
    let itemOfPage = app.getConfig('pagination').numberItem || 10;

    controller.category_list = function (req, res) {
        let page = req.params.page || 1;

        let tableStructure = [
            {
                column: 'id',
                width: '1%',
                header: '',
                type: 'checkbox'
            },
            {
                column: 'name',
                header: __('all_table_column_name'),
                width: '40%',
                link: '/admin/categories/{id}',
                type: 'inline',
                pk: '{id}',
                filter: {

                    data_type: 'string'
                }
            },
            {
                column: 'alias',
                header: __('all_table_column_alias'),
                width: '40%',
                link: '/admin/categories/{id}',
                type: 'inline',
                pk: '{id}'
            },
            {
                column: 'count',
                header: __('m_category_backend_category_filter_column_post'),
                width: '19%'
            }
        ];

        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addRefreshButton('/admin/categories');
        toolbar.addSearchButton('true');
        toolbar.addDeleteButton(isAllow(req, 'category_delete'));
        toolbar = toolbar.render();

        // Config columns
        let filter = ArrowHelper.createFilter(req, res, tableStructure, {
            rootLink: '/admin/categories/page/$page/sort',
            limit: itemOfPage
        });

        app.models.category.findAndCountAll({
            where: filter.conditions,
            order: filter.sort,
            limit: filter.limit,
            offset: filter.offset
        }).then(function (results) {
            let totalPage = Math.ceil(results.count / itemOfPage);

            res.backend.render('index', {
                title: __('m_category_backend_category_render_title'),
                totalPage: totalPage,
                currentPage: page,
                items: results.rows,
                toolbar: toolbar
            });

        }).catch(function (err) {
            logger.error(err);
            req.flash.error('Name: ' + err.name + '<br />' + 'Message: ' + err.message);

            // Render view if has error
            res.backend.render('index', {
                title: __('m_category_backend_category_render_title'),
                totalPage: 1,
                items: null,
                currentPage: page
            });
        });
    };

    controller.category_save = function (req, res) {

        let data = req.body;
        data.name = data.name.trim();

        app.models.category.create(data)
            .then(function () {
                req.flash.success(__('m_category_backend_category_flash_save_success'));
                res.redirect('/admin/categories');
            }).catch(function (err) {
                logger.error(err);
                req.flash.error(err.name + ': ' + err.message);
                res.redirect('/admin/categories');
            });
    };

    controller.category_update = function (req, res) {

        let data = req.body;

        if (data.name == 'name') {
            data.name = data.value.trim();
        }

        if (data.name == 'alias') {
            delete data['name'];
            data.alias = slug(data.value.trim()).toLowerCase();
        }

        app.models.category.find({
            where: {
                id: req.params.catId
            }
        }).then(function (cat) {
            return cat.updateAttributes(data);
        }).then(function () {
            let response = {
                type: 'success',
                message: __('m_category_backend_category_update_success')
            };
            res.json(response);
        }).catch(function (err) {
            let response = {
                type: 'error',
                message: err.message
            };
            res.json(response);
        })
    };

    controller.category_delete = function (req, res, next) {

        let listId = req.body.ids.split(',');

        promise.all([
            promise.map(listId, function (id) {
                return app.models.post.findAndCountAll({
                    where: {
                        categories: {
                            $like: '%:' + id + ':%'
                        }
                    }
                }).then(function (posts) {
                    if (posts.count > 0) {
                        // Update posts have tag is deleted category
                        return app.models.category.find({
                            where: {
                                name: 'Uncategorized'
                            }
                        }).then(function (uncat) {
                            return promise.map(posts.rows, function (post) {
                                let btag = post.categories;
                                if (post.categories == (':' + id + ':')) {
                                    let newBtag = btag.replace(':' + id + ':', ':' + uncat.id + ':');
                                    return post.updateAttributes({
                                        categories: newBtag
                                    }).then(function () {
                                        return uncat.updateAttributes({
                                            count: +uncat.count + 1
                                        });
                                    });
                                } else {
                                    return null;
                                }
                            });
                        });
                    } else {
                        return null;
                    }
                });
            }),
            app.models.category.destroy({
                where: {
                    id: {
                        'in': req.body.ids.split(',')
                    }
                }
            })
        ]).then(function () {
            req.flash.success(__('m_category_backend_category_flash_delete_success'));
            res.sendStatus(200);
        }).catch(function (err) {
            req.flash.error(err.name + ': ' + err.message);
            res.sendStatus(200);
        })
    };
};

