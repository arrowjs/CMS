'use strict';

module.exports = function (component) {
    let controller = component.controllers.frontend;

    return {


        // Categories  router
        "category/:alias([0-9a-zA-Z-]+)/:id([0-9]+)(/)?": {
            get: {
                handler: controller.listPostByCategory
            }
        },
        "category/:alias([0-9a-zA-Z-]+)/:id([0-9]+)/page-:page([0-9]+)?(/)?": {
            get: {
                handler: controller.listPostByCategory
            }
        }


    }
};