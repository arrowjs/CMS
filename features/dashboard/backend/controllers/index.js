'use strict';

let promise = require('arrowjs').Promise;

module.exports = function (cont, comp, app) {
    cont.view = function (req, res) {
        promise.all([
            app.feature.users.actions.findAndCountAll({
                where: {
                    user_status: 'publish'
                },
                limit: 8,
                order: 'id DESC'
            }),
            app.feature.blog.actions.findAndCountAll({
                where: {
                    published: 1,
                    type: 'post'
                },
                limit: 4,
                order: 'id DESC'
            }),
            app.feature.blog.actions.count({
                where: {
                    published: 1,
                    type: 'page'
                }
            }),
            app.feature.category.actions.count()
        ]).then(function (results) {
            res.backend.render('index', {
                pageStatistic: results[2],
                postStatistic: results[1].count,
                userStatistic: results[0].count,
                categoryStatistic: results[3],
                newestUsers: results[0].rows,
                newestPosts: results[1].rows
            });
        }).catch(function (err) {
            res.backend.render('index');
        })
    };
};