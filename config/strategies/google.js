'use strict';

/**
 * Module dependencies.
 */
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


module.exports = function(passport,config,application) {
    // Use google strategy
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            // Set the provider data and include tokens
            let providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;
            // Create the user OAuth profile
            let providerUserProfile = {
                user_url: providerData.link,
                display_name: profile.displayName,
                user_email: profile.emails[0].value,
                user_login: profile.emails[0].value,
                role_id: 21,
                user_status: 'publish',
                provider: 'google',
                providerIdentifierField: 'id',
                providerData: providerData
            };

        }
    ));
};