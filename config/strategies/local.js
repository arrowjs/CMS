'use strict';

/**
 * Module dependencies.
 */
let LocalStrategy = require('passport-local').Strategy;


module.exports = function (passport,config,app) {
    // Use local strategy
    passport.use(new LocalStrategy(
        function (username, password, done) {
            app.models.user.find({
                where: [
                    "(lower(user_login) = ? or lower(user_email) = ?) and user_status='publish'", username.toLowerCase(), username.toLowerCase()
                ]
            }).then(function (user, err) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Invalid Username ! Please login again.'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false,{
                        message: 'Invalid Password ! Please login again.'
                    });
                }
                return done(null, user);
            });
        }
    ));
};