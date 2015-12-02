'use strict';

let slug = require('slug');
let _ = require('arrowjs')._;//lodash
let promise = require('arrowjs').Promise;

let route = 'blog';
let edit_view = 'post/new';
let logger = require('arrowjs').logger;

module.exports = function (controller, component, app) {

    let itemOfPage = app.getConfig('pagination').numberItem || 10;
    let isAllow = ArrowHelper.isAllow;

    controller.postList = function (req, res) {

        // Get current page and default sorting
        var page = req.params.page || 1;

        // Add buttons and check authorities
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addRefreshButton('/admin/blog/posts');
        toolbar.addSearchButton('true');
        toolbar.addCreateButton(isAllow(req, 'post_create'), '/admin/blog/posts/create');
        toolbar.addDeleteButton(isAllow(req, 'post_delete'));
        toolbar = toolbar.render();

        // Store search data to session
        let session_search = {};
        if (req.session.search) {
            session_search = req.session.search;
        }
        session_search[route + '_post_list'] = req.url;
        req.session.search = session_search;

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
                link: '/admin/blog/posts/{id}',
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
            rootLink: '/admin/blog/posts/page/$page/sort',
            limit: itemOfPage,
            customCondition: "AND type='post'"
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
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

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
    // get data to display post detail
    controller.postView = function (req, res) {
        // set back link default
        let back_link = '/admin/blog/posts/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_post_list']) {
            back_link = '/admin' + search_params[route + '_post_list'];
        }

        // Add button
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(isAllow(req, 'post_create'));
        toolbar.addDeleteButton(isAllow(req, 'post_delete'));

        promise.all([
            app.models.category.findAll({
                order: "id asc"
            }),
            app.models.user.findAll({
                order: "id asc"
            }),
            app.models.post.find({
                include: [app.models.user],
                where: {
                    id: req.params.cid,
                    type: 'post'
                }
            })
        ]).then(function (results) {
            let data ;
            if (req['post']){
                data = req.post;
            }else{
                data = results[2];
                data.full_text = data.full_text.replace(/&lt/g, "&amp;lt");
            }
            // Add preview button
            toolbar.addGeneralButton(isAllow(req, 'post_index'), 'Preview', '/admin/blog/posts/preview/' + results[2].id,
                {
                    icon: '<i class="fa fa-eye"></i>',
                    buttonClass: 'btn btn-info',
                    target: '_blank'
                });

            res.backend.render(edit_view, {
                title: __('m_blog_backend_post_render_update'),
                categories: results[0],
                users: results[1],
                post: data,
                toolbar: toolbar.render()
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
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
            promise.map(posts, function (post) {
                let tag = post.categories;
                if (tag != null && tag != '') {
                    tag = tag.split(':');
                    tag.shift();
                    tag.pop(tag.length - 1);

                    if (tag.length > 0) {
                        tag.forEach(function (id) {
                            app.models.category.findById(id).then(function (cat) {
                                let count = +cat.count - 1;
                                cat.updateAttributes({
                                    count: count
                                });
                            });
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
            logger.error('postDelete error : ', err);
        });
    };
    //update post after form submited
    controller.postUpdate = function (req, res, next) {
        // set back link default
        let back_link = '/admin/blog/posts/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_post_list']) {
            back_link = '/admin' + search_params[route + '_post_list'];
        }

        // Add button
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);

        // Get data in req.body and update
        let data = req.body;
        data.title = data.title.trim();
        if (data.alias == null || data.alias == '')
            data.alias = slug(data.title).toLowerCase();
        data.categories = data.categories || "";
        data.author_visible = (data.author_visible != null);
        if (!data.published) data.published = 0;

        app.models.post.findById(req.params.cid)
            .then(function (post) {
                let tag = post.categories;
                if (tag != null && tag != '') {
                    tag = tag.split(':');
                    tag.shift();
                    tag.pop(tag.length - 1);
                } else tag = [];

                let newtag = data.categories;
                if (newtag != null && newtag != '') {
                    newtag = newtag.split(':');
                    newtag.shift();
                    newtag.pop(newtag.length - 1);
                } else newtag = [];

                // Update count for category
                let onlyInA = [],
                    onlyInB = [];

                if (Array.isArray(tag) && Array.isArray(newtag)) {
                    onlyInA = tag.filter(function (current) {
                        return newtag.filter(function (current_b) {
                                return current_b == current
                            }).length == 0
                    });
                    onlyInB = newtag.filter(function (current) {
                        return tag.filter(function (current_a) {
                                return current_a == current
                            }).length == 0
                    });

                }

                if (data.published != post.published && data.published == 1) data.published_at = Date.now();

                // update data
                return post.updateAttributes(data)
                    .then(function () {
                        return promise.all([
                            promise.map(onlyInA, function (id) {
                                return app.models.category.findById(id).then(function (tag) {
                                    let count = +tag.count - 1;
                                    return tag.updateAttributes({
                                        count: count
                                    })
                                });
                            }),
                            promise.map(onlyInB, function (id) {
                                return app.models.category.findById(id).then(function (tag) {
                                    let count = +tag.count + 1;
                                    return tag.updateAttributes({
                                        count: count
                                    })
                                });
                            })
                        ])
                    })
            }).then(function () {
                req.flash.success(__('m_blog_backend_post_flash_update_success'));
                if(req['post'])
                delete req.post;
                next();
            }).catch(function (err) {
                let messageError ='' ;
                if(err.name == 'SequelizeValidationError'){
                    err.errors.map(function (e) {
                        if(e)
                            messageError += e.message+'<br />';
                    })
                }else if (err.name == 'SequelizeUniqueConstraintError'){
                    messageError = "Alias was duplicated";
                }else{
                    messageError = err.message;
                }
                req.flash.error(messageError);
                res.locals.post = data;
                next();
            });
    };

    controller.postCreate = function (req, res) {
        // Add button
        let back_link = '/admin/blog/posts/page/1';
        let search_params = req.session.search;
        if (search_params && search_params[route + '_post_list']) {
            back_link = '/admin' + search_params[route + '_post_list'];
        }
        let toolbar = new ArrowHelper.Toolbar();
        toolbar.addBackButton(back_link);
        toolbar.addSaveButton(isAllow(req, 'post_create'));
        toolbar = toolbar.render();

        promise.all([
            app.models.category.findAll({
                order: "id asc"
            }),
            app.models.user.findAll({
                order: "id asc"
            })
        ]).then(function (results) {
            res.backend.render(edit_view, {
                title: __('m_blog_backend_post_render_create'),
                categories: results[0],
                users: results[1],
                toolbar: toolbar
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.redirect(back_link);
        });
    };

    controller.postSave = function (req, res, next) {
        let data = req.body;
        data.title = data.title.trim();
        data.created_by = req.user.id;
        if (data.alias == null || data.alias == '')
            data.alias = slug(data.title).toLowerCase();
        data.type = 'post';
        if (!data.published) data.published = 0;
        if (data.published == 1) data.published_at = Date.now();

        let post_id = 0;

        app.models.post.create(data).then(function (post) {
            post_id = post.id;
            let tag = post.categories;

            if (tag != null && tag != '') {
                tag = tag.split(':');
                tag.shift();
                tag.pop(tag.length - 1);

                return promise.map(tag, function (id) {

                    return app.models.category.findById(id).then(function (tag) {
                        let count = +tag.count + 1;
                        return tag.updateAttributes({
                            count: count
                        })
                    });
                }).catch(function (err) {
                    logger.error(err);
                });
            }
        }).then(function () {
            req.flash.success(__('m_blog_backend_post_flash_create_success'));
            res.redirect('/admin/blog/posts/' + post_id);
        }).catch(function (err) {
            let messageError ='' ;
            if(err.name == 'SequelizeValidationError'){
                err.errors.map(function (e) {
                    if(e)
                        messageError += e.message+'<br />';
                })
            }else if (err.name == 'SequelizeUniqueConstraintError'){
                messageError = "Alias was duplicated";
            }else{
                messageError = err.message;
            }
            req.flash.error(messageError);
            res.locals.post = data;
            next();
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
        if (searchText != '') conditions += " AND title ilike '%" + searchText + "%'";

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