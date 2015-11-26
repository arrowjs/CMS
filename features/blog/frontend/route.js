'use strict';

module.exports = function (component) {
    let controller = component.controllers.frontend;

    return {

        // Post router

        "/blog/posts": {
            get: {
                handler: controller.allPosts
            }
        },
        '/blog/posts/page-:page([0-9]+)?(/)?': {
            get: {
                handler: controller.allPosts
            }
        },
        "/blog/posts/:postId([0-9]+)/:postAlias": {
            get: {
                handler: controller.postDetail
            }
        },

        // Archive router
        "/blog/posts/archives/:year([0-9]{4})/:month([0-9]{2})(/)?": {
            get: {
                handler: controller.listArchive
            }
        },
        "/blog/posts/archives/:year([0-9]{4})/:month([0-9]{2})/page-:page([0-9])(/)?": {
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
        "/blog/posts/search(/page/:page([0-9]+)/(:searchStr)?)?" : {
            get : {
                handler : controller.search
            }
        },
        // Categories  router
        "/blog/posts/categories/:alias([0-9a-zA-Z-]+)/:id([0-9]+)(/)?": {
            get: {
                handler: controller.listPostByCategory
            }
        },
        "/blog/posts/categories/:alias([0-9a-zA-Z-]+)/:id([0-9]+)/page-:page([0-9]+)?(/)?": {
            get: {
                handler: controller.listPostByCategory
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