'use strict';

/**
 * Module dependencies.
 */
let bcrypt = require('bcrypt'),
    LocalStrategy = require('passport-local').Strategy;


module.exports = function (passport,config,application) {
    // Use local strategy
    passport.use(new LocalStrategy(
        function (username, password, done) {
            application.models.user.find({
                where: {
                    username: username
                }
            }).then(function (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        return done(err);
                    }
                    if (!result) {
                        return done(null, false, {message: 'Incorrect username and password'});
                    }
                    return done(null, user);
                })
            }).catch(function (err) {
                return done(err);
            })
        }
    ));
};