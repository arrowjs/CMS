'use strict';

module.exports = {
    resource : {
        path : ['themes','upload'],
        option : {
            maxAge: 3600
        }
    },
    viewExtension : 'twig',
    pagination: {
        numberItem: 10,
        frontNumberItem : 10
    },
    date_format : 'DD-MM-YYYY',
    backendTheme: 'adminLTE',
    frontendTheme: 'acme',
    functionFolder : '/library/view_utilities/functions',
    filterFolder : '/library/view_utilities/filters',
    variableFile : '/library/view_utilities/variables/global.js',
    defaultImage : '/img/noImage.png',
    nunjuckSettings : {
        autoescape: true,
        throwOnUndefined: false,
        trimBlocks: false,
        lstripBlocks: false,
        watch: false,
        noCache: true
    }
};