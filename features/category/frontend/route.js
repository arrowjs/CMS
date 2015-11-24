'use strict';

module.exports = function (component, application) {
    let comp = component.controllers.frontend;

    return {
        // Categories  router
        "/categories/:alias([0-9a-zA-Z-]+)/:id([0-9]+)(/)?": {
            get: {
                handler: comp.listPostByCategory
            }
        },
        "/categories/:alias([0-9a-zA-Z-]+)/:id([0-9]+)/page-:page([0-9]+)?(/)?": {
            get: {
                handler: comp.listPostByCategory
            }
        }
    }
};