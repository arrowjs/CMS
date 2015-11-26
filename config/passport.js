'use strict';

let logger = require('arrowjs').logger;

module.exports = function (passport, application) {
    return {
        serializeUser: function (user, done) {
            done(null, user.id);
        },
        deserializeUser: function (id, done) {
            application.models.user.findById(id).then(function (user) {
                done(null, user);
            }).catch(function (err) {
                done(err)
            });
        },
        checkAuthenticate: function (req, res, next) {
            if (req.isAuthenticated()) {
                application.models.user.find({
                    where: {
                        id: req.user.id
                    },
                    include: application.models.role
                }).then(function (user) {
                    try {
                        req.session.permissions = JSON.parse(user.role.permissions);
                    } catch (err) {
                        req.session.permissions = null;
                    }
                    res.locals.user = user;
                    return next();
                }).catch(function (err) {
                    logger.error('Error at : checkAuthenticate :', err);
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