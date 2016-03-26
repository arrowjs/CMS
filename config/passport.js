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
                app.models.user.find({
                    where: {
                        id: req.user.id
                    },
                    include: app.models.role
                }).then(function (user) {
                    try {
                        req.session.permissions = res.locals.permissions = JSON.parse(user.role.permissions);
                    } catch (err) {
                        req.session.permissions = null;
                    }
                    res.locals.user = user;
                    return next();
                }).catch(function (err) {
                    logger.error('Check authenticate error: ', err);
                    res.redirect('/admin/login');
                });
            } else {
                res.redirect('/admin/login');
            }
        },
        handlePermission: function (req, res, next) {
            if (req.hasPermission) {
                res.locals.user = req.user;
                return next()
            } else {
                req.flash.error("You do not have permission to access");
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