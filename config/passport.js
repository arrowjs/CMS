'use strict';
/**
 * Module init function.
 */
module.exports = function (passport, application) {
    return {
        "defaultStrategy": "local",
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