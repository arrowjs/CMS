"use strict";

var favicon = require('serve-favicon');

/**
 * Setting for express
 * @param app
 * @param config : config file
 * @param setting : user setting
 * @returns {*}
 */
module.exports = function (app, config, setting) {

    /**
     * Set folder static resource
     */
    app.use(favicon(__base + 'upload/img/favicon.ico'));

    app.middleware.serveStatic();

    /**
     * Set local variable
     */
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;

    /** Showing stack errors */
    app.set('showStackError', true);

    /** Set views path and view engine */
    app.set('view engine', 'html');

    /** Environment dependent middleware */
    if (process.env.NODE_ENV === 'development') {
        /** Uncomment to enable logger (morgan) */
        app.use(app.middleware.morgan('dev'));
        /** Disable views cache */
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    app.use(app.middleware.bodyParser.urlencoded({extended: false}));
    app.use(app.middleware.bodyParser.json());
    app.use(app.middleware.methodOverride());

    /** CookieParser should be above session */
    app.use(app.middleware.cookieParser());

    /** Express session storage */
    app.middleware.session();

    /** Use passport session */
    app.middleware.passport(setting);

    /** Flash messages */
    app.middleware.flashMessage();

    /** Use helmet to secure Express headers */
    let helmet = app.middleware.helmet;

    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    /** Passing the variables to environment locals */
    app.use(function (req, res, next) {
        //res.locals.hasOwnProperty = Object.hasOwnProperty;
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        res.locals.path = req.protocol + '://' + req.headers.host;
        res.locals.route = req.url;

        next();
    });

    return app;
};