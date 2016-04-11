'use strict';

module.exports = function (controller, component, app) {

    controller.view = function (req, res) {
        res.backend.render('login');
    };

    controller.logout = function (req, res) {
        if (req.user && req.user.id) {
            // Remove cache
            let redis = app.redisClient;
            redis.del(app.getConfig('redis_prefix') + 'current-user-' + req.user.id);
        }

        req.logout();

        if (req.session.prelink) {
            return res.redirect(req.session.prelink);
        }
        res.redirect('/');
    };

    controller.notHavePermission = function (req, res) {
        res.backend.render('_403');
    }
};