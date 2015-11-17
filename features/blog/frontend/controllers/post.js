'use strict';

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
};