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
                        err: 'Username or password invalid'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Username or password invalid'
                    });
                }
                return done(null, user);
            });
        }
    ));
};