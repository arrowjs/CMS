'use strict';

let logger = require('arrowjs').logger;

module.exports = function (passport, app) {
    return {
        serializeUser: function (user, done) {
            done(null, user.id);
        },
        deserializeUser: function (id, done) {
            let redis = app.redisClient;
            let key = app.getConfig('redis_prefix') + 'current-user-' + id;

            redis.get(key, function (err, result) {
                if (result != null) {
                    let user;
                    try {
                        user = JSON.parse(result);
                    } catch (err) {
                        logger.error(err);
                        done(null, false);
                    }

                    done(null, user);
                } else {
                    app.feature.users.actions.find({
                        include: [app.models.role],
                        where: {
                            id: id,
                            user_status: 'publish'
                        }
                    }).then(function (user) {
                        let user_tmp;
                        try {
                            user_tmp = JSON.parse(JSON.stringify(user));
                        } catch (err) {
                            logger.error(err);
                            done(null, false);
                        }

                        // Set expires 300 seconds
                        redis.setex(key, 300, JSON.stringify(user_tmp));
                        done(null, user_tmp);
                    }).catch(function (err) {
                        logger.error(err);
                        done(null, false);
                    });
                }
            });
        },
        checkAuthenticate: function (req, res, next) {
            if (req.isAuthenticated()) {
                try {
                    req.session.permissions = res.locals.permissions = JSON.parse(req.user.role.permissions);
                } catch (err) {
                    req.session.permissions = null;
                }

                res.locals.user = req.user;
                next();
            } else {
                if (req.originalUrl.indexOf('/admin') == -1)
                    res.redirect('/');
                else
                    res.redirect('/admin/login');
            }
        },
        handlePermission: function (req, res, next) {
            if (req.hasPermission) {
                res.locals.user = req.user;
                return next()
            } else {
                req.flash.error('You do not have permission to access');
                res.redirect('/admin/403');
            }
        },
        local_login: {
            strategy: 'local',
            option: {
                successRedirect: '/admin',
                failureRedirect: '/admin/login',
                failureFlash: true

            }
        }
    }
};