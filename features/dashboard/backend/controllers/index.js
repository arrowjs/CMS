/**
 * Created by thangnv on 11/11/15.
 */
'use strict';
let promise = require('bluebird');

module.exports = function (cont, comp, app) {
    cont.view = function (req, res) {
        promise.all([
            app.models.user.findAndCountAll({
                where : {
                    user_status : 'publish'
                },
                limit : 8,
                order : 'id DESC'
            }),
            app.models.post.count({
                where : {
                    published : 1,
                    type : 'post'
                }
            }),
            app.models.post.count({
                where : {
                    published : 1,
                    type : 'page'
                }
            }),
            app.models.category.count()
        ]).then(function (results) {
            console.log(results[0].rows);
            res.backend.render('index', {
                pageStatistic : results[2],
                postStatistic : results[1],
                userStatistic : results[0].count,
                categoryStatistic : results[3],
                newestUsers : results[0].rows

            });
        }).catch(function (err) {
            res.backend.render('index');
        })







    };
};