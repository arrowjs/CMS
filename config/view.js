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
        number_item: 20
    },
    frontendTheme: "acme",
    backendTheme: "adminLTE",
    functionAndVariableFolder : '/libraries/functions',
    filterFolder : '/libraries/filters'
};