"use strict";

/**
 * Base config nunjucks and static resource
 * @type {{resource: {path: string, option: {maxAge: number}}, viewExtension: string, pagination: {number_item: number}, theme: string, functionFolder: string, filterFolder: string, variableFile: string, nunjuckSettings: {autoescape: boolean, throwOnUndefined: boolean, trimBlocks: boolean, lstripBlocks: boolean, watch: boolean, noCache: boolean}}}
 */
module.exports = {
    resource : {
        path : 'public',
        option : {
            maxAge: 3600
        }
    },
    viewExtension : "html",
    pagination: {
        number_item: 20
    },
    theme: "default",
    functionFolder : '/extendsView/function',
    filterFolder : '/extendsView/filter',
    variableFile : '/extendsView/variable.js',
    nunjuckSettings : {
        autoescape: true,
        throwOnUndefined: false,
        trimBlocks: false,
        lstripBlocks: false,
        watch: false,
        noCache: true
        //tags: {
        //    blockStart: '<%',
        //    blockEnd: '%>',
        //    variableStart: '<$',
        //    variableEnd: '$>',
        //    commentStart: '<#',
        //    commentEnd: '#>'
        //}
    }

};