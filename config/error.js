"use strict";

module.exports = {
    fault_tolerant : {
        //enable : false,
        logdata : ["body","query"],//
        render : '',
        redirect : '500'
    },
    error : {
        "404" : {
            render : "404"
        },
        "500" : {
            render : "500"
        },
        "403" : {
            render : "403"
        }

    }
};