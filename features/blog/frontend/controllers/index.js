'use strict';

module.exports = function (controller, component, application) {
    controller.index = function (req, res) {
        // Find all posts
        component.models.post.findAll({
            limit: 10
        }).then(function (posts) {
            res.frontend.render('index', {
                posts: posts
            })
        });
    };
};