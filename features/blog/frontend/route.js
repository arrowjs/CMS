'use strict';

module.exports = function (component) {
    let controller = component.controllers.frontend;

    return {

        // Post router

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
        },

        // Archive router
        "/blog/archives/:year([0-9]{4})/:month([0-9]{2})(/)?": {
            get: {
                handler: controller.listArchive
            }
        },
        "/blog/archives/:year([0-9]{4})/:month([0-9]{2})/page-:page([0-9])(/)?": {
            get: {
                handler: controller.listArchive
            }
        },

        // All Posts by author
        "/blog/posts/:author([0-9]+)(/)?": {
            get: {
                handler: controller.listByAuthor
            }
        },
        "/blog/posts/:author/page-:page([0-9]+)?(/)?": {
            get: {
                handler: controller.listByAuthor
            }
        },

        // Page router
        "/blog/:alias([a-zA-Z0-9-]+)(/)?": {
            get: {
                handler: controller.pageIndex
            }
        }

    }
};