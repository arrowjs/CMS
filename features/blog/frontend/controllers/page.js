'use strict';

let promise = require('arrowjs').Promise;

module.exports = function (controller, component, app) {

    controller.pageIndex = function (req, res) {
        app.models.post.find({
            include: [
                {
                    model: app.models.user,
                    attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                }
            ],
            where: {
                alias: req.params.alias,
                type: 'page',
                published: 1
            }
        }).then(function (results) {
            if (results) {
                // Render view
                res.frontend.render('page', {
                    pageTitle: results.dataValues.title,
                    item: results.dataValues
                });
            } else {
                // Redirect to 404 if page not exist
                res.frontend.render('_404');
            }
        });
    }
};