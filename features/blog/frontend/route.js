'use strict';

module.exports = function (component) {
    let controller = component.controllers.frontend;

    return {
        "/blog": {
            get: {
                handler: controller.allPosts
            }
        },
        '/blog/page-:page([0-9]+)?(/)?': {
            get: {
                handler: controller.allPosts
            }
        },
        "/blog/:postId([0-9]+)/:postAlias": {
            get: {
                handler: controller.postDetail
            }
        }
    }
};