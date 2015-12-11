'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component, application) {

    let controller = component.controllers.backend;

    return {
        // Post
        "/blog": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: ["post_index_all", "post_index"]
            },
            param: {
                key: "postId",
                handler: controller.postRead
            }
        },
        "/blog/posts": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: ["post_index_all", "post_index"]
            },
            delete: {
                handler: controller.postDelete,
                authenticate: true,
                permissions: "post_delete"
            }
        },
        "/blog/posts/page/:page": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: ["post_index_all", "post_index"]
            }
        },
        "/blog/posts/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: ["post_index_all", "post_index"]
            }
        },
        "/blog/posts/create": {
            get: {
                handler: controller.postCreate,
                authenticate: true,
                permissions: "post_create"
            },
            post: {
                handler: [controller.postSave, controller.postCreate],
                authenticate: true,
                permissions: "post_create"
            }
        },
        "/blog/posts/:postId([0-9]+)": {
            get: {
                handler: controller.postView,
                authenticate: true,
                permissions: ["post_index_all", "post_index"]
            },
            post: {
                handler: [controller.postUpdate, controller.postView],
                authenticate: true,
                permissions: ["post_edit_all", "post_edit"]
            }
        },
        "/blog/posts/preview/:postId([0-9]+)": {
            get: {
                handler: controller.postPreview,
                authenticate: true,
                permissions: ["post_index_all", "post_index"]
            }
        },
        // Post category
        "/blog/categories": {
            get: {
                handler: controller.categoryList,
                authenticate: true,
                permissions: "category_index"
            },
            delete: {
                handler: controller.categoryDelete,
                authenticate: true,
                permissions: "category_delete"
            }
        },
        "/blog/categories/page/:page": {
            get: {
                handler: controller.categoryList,
                authenticate: true,
                permissions: "category_index"
            }
        },
        "/blog/categories/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.categoryList,
                authenticate: true,
                permissions: "category_index"
            }
        },
        "/blog/categories/quick-create": {
            post: {
                handler: controller.categoryQuickCreate,
                authenticate: true,
                permissions: "category_create"
            }
        },
        "/blog/categories/create": {
            get: {
                handler: controller.categoryCreate,
                authenticate: true,
                permissions: "category_create"
            },
            post: {
                handler: [controller.categorySave, controller.categoryCreate],
                authenticate: true,
                permissions: "category_create"
            }
        },
        "/blog/categories/:categoryId([0-9]+)": {
            get: {
                handler: controller.categoryView,
                authenticate: true,
                permissions: "category_edit"
            },
            post: {
                handler: [controller.categoryUpdate, controller.categoryView],
                authenticate: true,
                permissions: "category_edit"
            }
        },
        // Page
        "/blog/pages": {
            get: {
                handler: controller.pageList,
                authenticate: true,
                permissions: ["page_index_all", "page_index"]
            },
            delete: {
                handler: controller.pageDelete,
                authenticate: true,
                permissions: "page_delete"
            }
        },
        "/blog/pages/page/:page": {
            get: {
                handler: controller.pageList,
                authenticate: true,
                permissions: ["page_index_all", "page_index"]
            }
        },
        "/blog/pages/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.pageList,
                authenticate: true,
                permissions: ["page_index_all", "page_index"]
            }
        },
        "/blog/pages/create": {
            get: {
                handler: controller.pageCreate,
                authenticate: true,
                permissions: "page_create"
            },
            post: {
                handler: [controller.pageSave, controller.pageCreate],
                authenticate: true,
                permissions: "page_create"
            }
        },
        "/blog/pages/:postId([0-9]+)": {
            get: {
                handler: controller.pageView,
                authenticate: true,
                permissions: ["page_index_all", "page_index"]
            },
            post: {
                handler: [controller.pageUpdate, controller.pageView],
                authenticate: true,
                permissions: ["page_edit_all", "page_edit"]
            }
        },
        "/blog/page/preview/:postId([0-9]+)": {
            get: {
                handler: controller.pagePreview,
                authenticate: true,
                permissions: ["page_index_all", "page_index"]
            }
        },

        /*
         * Defines route for add link menu
         * */
        "/blog/post/link/menu": {
            get: {
                handler: controller.linkMenuPost,
                authenticate: true
            }
        },
        "/blog/page/link/menu": {
            get: {
                handler: controller.linkMenuPage,
                authenticate: true
            }
        }
    }

};