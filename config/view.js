"use strict";

module.exports = {
    resource : {
        path : ['themes','upload'],
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
    functionAndVariableFolder : '/libraries/functions',
    filterFolder : '/libraries/filters'
};