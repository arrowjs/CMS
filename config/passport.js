'use strict';
/**
 * Module init function.
 */
let _log = require('arrowjs').logger;
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
                    req.session.permissions = JSON.parse(user.role.rules);
                    res.locals.permissions = req.session.permissions;
                    res.locals.user = user;
                    return next();
                }).catch(function (err) {
                    _log.error('Error at : checkAuthenticate :', err);
                    res.redirect('/admin/login');
                });
            } else {
                res.redirect('/admin/login');
            }
        },
        handlePermission: function (req, res, next) {
            console.log(req.hasPermission);
            if (req.hasPermission) {
                return next()
            } else {
                req.flash.error("You do not have permission to access");
                res.redirect('/admin/not-permission');
            }
        },
        local_login: {
            strategy: 'local',
            option: {
                successRedirect: '/admin',
                failureRedirect: '/admin/login',
                failureFlash: true

            }
        },
        'facebook': {
            option: {
                successRedirect: '/',
                failureRedirect: '/users/login'
            }
        }
    }

};