"use strict";

module.exports = {
    resource : {
        path : 'themes',
        option : {
            maxAge: 3600
        }
    },
    viewExtension : "twig",
    pagination: {
        numberItem: 20
    },
    backendTheme: "adminLTE",
    frontendTheme: "acme",
    functionFolder : '/library/view_utilities/functions',
    filterFolder : '/library/view_utilities/filters',
    variableFile : '/library/view_utilities//variables/global.js',
    nunjuckSettings : {
        autoescape: true,
        throwOnUndefined: false,
        trimBlocks: false,
        lstripBlocks: false,
        watch: false,
        noCache: true
    }
};