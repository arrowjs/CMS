'use strict';

module.exports = {
    secret: 'helloArrow',
    key: 'sid',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    },
    redis_prefix: 'sess : '
};