'use strict';

/**
 * Setting express-session
 * @type {{secret: string, key: string, resave: boolean, saveUninitialized: boolean, cookie: {httpOnly: boolean}, redis_prefix: string}}
 */
module.exports = {
    secret: "helloArrow",
    key: 'sid',
    resave: true,
    saveUninitialized: true,
    cookie : {
        httpOnly: true
    },
    redis_prefix : "sess : "
};