'use strict';

let promise = require('bluebird');

module.exports = function (controller, component, application) {
    controller.allPosts = function (req, res) {
        let page = req.params.page || 1;
        let number_item = 10;
        let totalPage = 1;

        component.models.post.findAndCountAll({
            where: {
                type: 'post',
                published: 1
            },
            offset: (page - 1) * number_item,
            limit: number_item,
            order: 'id DESC'
        }).then(function (posts) {
            if (posts) {

                totalPage = Math.ceil(parseInt(posts.count) / number_item) || 1;

                // Render view
                res.frontend.render('all_post', {
                    posts: posts.rows,
                    totalPage: totalPage,
                    currentPage: page,
                    baseURL: '/blogs/posts/page-'
                });
            } else {
                // Redirect to 404 if posts not exist
                res.frontend.render('_404');
            }
        });
    };

    controller.postDetail = function (req, res) {
        let postId = req.params.postId;

        component.models.post.find({
            where: {
                id: postId,
                type: 'post',
                published: 1
            },
            raw: true
        }).then(function (post) {
            if (post) {
                // Render view
                res.frontend.render('post_detail', {
                    post: post
                });
            } else {
                // Redirect to 404 if post not exist
                res.frontend.render('_404');
            }
        });
    };


    controller.listArchive = function (req, res) {

        let month_ = req.params.month || '01';
        let year_ = req.params.year || '2000';
        let page = req.params.page || 1;

        let number_item = application.getConfig('pagination').frontNumberItem || 10;

        let sql = 'select posts.*,users.user_login,users.user_pass,users.user_email,users.user_url,users.user_registered,users.display_name,' +
            'users.user_activation_key,users.user_image_url,users.salt,users.user_status,users.phone ' +
            'from arr_post as posts left outer join arr_user as users on posts.created_by = users.id WHERE' +
            ' "posts"."type" = \'post\' AND "posts"."published" = 1 AND EXTRACT(MONTH FROM posts.created_at ) = ' + month_ + ' AND EXTRACT(YEAR FROM posts.created_at) = ' + year_ +
            ' ORDER BY posts.id ASC OFFSET ' + (page - 1) * number_item + ' LIMIT ' + number_item;

        let sqlCount = 'select count(*) ' +
            'from arr_post as posts WHERE' +
            ' "posts"."type" = \'post\' AND "posts"."published" = 1 AND EXTRACT(MONTH FROM posts.created_at ) = ' + month_ + ' AND EXTRACT(YEAR FROM posts.created_at) = ' + year_;


        application.models.rawQuery(sql)
            .then(function (result) {
                if (result) {
                    // Render view
                    application.models.rawQuery(sqlCount)
                        .then(function (countPost) {
                            let totalPage = Math.ceil(countPost[0][0].count / number_item) || 1;
                            res.frontend.render('archives', {
                                posts: result[0],
                                archives_date: year_ + ' ' + month_,
                                month: month_,
                                totalPage: totalPage,
                                currentPage: page,
                                route: '/blog/archives/' + year_ + '/' + month_ + '/page-{page}'
                            });
                        })

                } else {
                    // Redirect to 404 if post not exist
                    res.frontend.render('_404');
                }
            }).catch(function (err) {
                res.send("error");
                console.log(err.stack);
            });


    };


    controller.listByAuthor = function (req, res) {

        let page = req.params.page || 1;
        let number_item = application.getConfig('pagination').frontNumberItem || 10;
        let totalPage = 1;

        promise.all(
            [
                // Find all post
                component.models.post.findAndCountAll({
                    include: [
                        {
                            model: application.models.user,
                            attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                        }
                    ],
                    where: {
                        type: 'post',
                        created_by: req.params.author,
                        published: 1

                    },
                    offset: (page - 1) * number_item,
                    limit: number_item,
                    order: 'id DESC'
                })
            ]
        ).then(function (results) {

                if (results) {
                    totalPage = Math.ceil(parseInt(results[0].count) / number_item) || 1;

                    // Render view
                    res.frontend.render('author', {
                        posts: results[0].rows,
                        totalPage: totalPage,
                        currentPage: page,
                        route: '/posts/' + req.params.author + '/page-{page}',
                        byAuthor: req.params.author
                    });
                } else {
                    // Redirect to 404 if post not exist
                    res.frontend.render404(req, res);
                }
            }).catch(function (err) {
                console.log(err.stack)
            });
    };

};