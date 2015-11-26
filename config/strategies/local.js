'use strict';

/**
 * Module dependencies.
 */
let LocalStrategy = require('passport-local').Strategy;
let log = require('arrowjs').logger;

module.exports = function (passport,config,app) {
    // Use local strategy
    passport.use(new LocalStrategy(
        function (username, password, done) {
            app.models.user.find({
                where: [
                    "(lower(user_login) = ? or lower(user_email) = ?) and user_status='publish'", username.toLowerCase(), username.toLowerCase()
                ],
                include : [
                    {
                        model : app.models.role
                    }
                ]
            }).then(function (user, err) {
                if (err) {
                    return done(err);
                }else if (!user) {
                    ArrowHelper.createUserAdmin(app, function (result) {
                        if(!result){
                            return done(null, false, {
                                message: 'Invalid Username ! Please login again.'
                            });
                        }else{
                            return done(null, false, {
                                message: 'Username default is \"admin\" <br> Password default is \"123456\" <br> Please login again !'
                            });
                        }
                    })
                }else if (!user.authenticate(password)) {
                    return done(null, false,{
                        message: 'Invalid Password ! Please login again.'
                    });
                }else {
                    return done(null, user);
                }
            }).catch(function (err) {
                log.error(err);
                return done(null, false,{
                    message : 'Database error ! Please login again.'
                });
            });
        }
    ));
};