'use strict';
/**
 * Setting passport
 * @param passport
 * @param application
 * @returns {{serializeUser: Function, deserializeUser: Function, checkAuthenticate: Function, handlePermission: Function, local1: {strategy: string, option: {successRedirect: string, failureRedirect: string}}, facebook1: {strategy: string, option: {successRedirect: string, failureRedirect: string}}}}
 */
module.exports = function (passport, application) {
    return {
        serializeUser: function (user, done) {
            done(null, user.id);
        },
        deserializeUser: function (id, done) {
            application.models.user.findById(id).then(function (user) {
                done(null,user);
            }).catch(function (err) {
                done(err)
            });
        },
        checkAuthenticate : function (req,res,next) {
            if(req.isAuthenticated()){
                return next();
            } else {
                res.redirect('/login');
            }
        },
        handlePermission : function (permission,req,res,next) {
            if(permission) {
              return  next()
            }
            req.flash.error("You do not have permission to access");
            res.redirect('/');
        },
        local1: {
            strategy : 'local',
            option: {
                successRedirect: '/',
                failureRedirect: '/login'
            }
        },
        'facebook1': {
            strategy : 'facebook',
            option: {
                successRedirect: '/',
                failureRedirect: 'users/login'
            }
        }
    }

};