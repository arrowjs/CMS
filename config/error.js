"use strict";

module.exports = {
    fault_tolerant : {
        enable : false,
        logdata : ["body","query"],//
        render : '',
        redirect : '500'
    },
    error : {
        "404" : {
            render : "public/404.html"
        },
        "500" : {
            render : "public/500.html"
        }
    }
};