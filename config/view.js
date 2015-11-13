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
    theme: "acme",
    functionAndVariableFolder : '/libraries/functions',
    filterFolder : '/libraries/filters'
};