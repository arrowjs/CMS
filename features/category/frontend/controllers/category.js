'use strict';

let promise = require('bluebird');

module.exports = function (controller, component, app) {

    controller.listPostByCategory = function (req, res) {

        let page = req.params.page || 1;
        let number_item = app.getConfig('pagination').frontNumberItem || 10;


        promise.all([
            app.models.post.findAndCountAll({
                include: [
                    {
                        model: app.models.user,
                        attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                    }
                ],
                where: {
                    categories: {$like: '%:' + req.params.id + ':%'},
                    type: 'post',
                    published: 1
                },
                order: 'id ASC',
                offset: (page - 1) * number_item,
                limit: number_item
            }),
            app.models.category.findAll({
                order: 'id ASC'
            }),
            app.models.category.findById(req.params.id)
        ]).then(function (result) {

            let totalPage = Math.ceil(result[0].count / number_item);

            if (result) {
                // Render view
                res.frontend.render('category', {
                    posts: result[0].rows,
                    numberOfPost: result[0].rows.length,
                    category: result[2],
                    categories: result[1],
                    totalPage: totalPage,
                    currentPage: page
                });
            } else {
                //Redirect to 404 if post not exist
                res.frontend.render404(req, res);
            }
        }).catch(function (err) {
            console.log(err.stack);
        });

    }
};