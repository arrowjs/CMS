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
                permissions: "post_index"
            },
            param: {
                key: "cid",
                handler: controller.postRead
            }
        },
        "/blog/posts/page/:page": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: "post_index"
            }
        },
        "/blog/posts/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: "post_index"
            }
        },
        "/blog/posts": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: "post_index"
            },
            delete: {
                handler: controller.postDelete,
                authenticate: true,
                permissions: "post_delete"
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
        "/blog/posts/:cid": {
            get: {
                handler: controller.postView,
                authenticate: true,
                permissions: "post_index"
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
                permissions: "post_index"
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
                handler: controller.category_delete,
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
        "/blog/categories/create": {
            post: {
                handler: controller.categorySave,
                authenticate: true,
                permissions: "category_create"
            }
        },
        "/blog/categories/quick-create": {
            post: {
                handler: controller.categoryQuickSave,
                authenticate: true,
                permissions: "category_create"
            }
        },
        "/blog/categories/:catId": {
            post: {
                handler: controller.categoryUpdate,
                authenticate: true,
                permissions: "category_edit"
            }
        },
        // Page
        "/blog/pages": {
            get: {
                handler: controller.pageList,
                authenticate: true,
                permissions: "page_index"
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
                permissions: "page_index"
            }
        },
        "/blog/pages/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.pageList,
                authenticate: true,
                permissions: "page_index"
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
        "/blog/pages/:cid([0-9]+)": {
            get: {
                handler: controller.pageView,
                authenticate: true,
                permissions: "page_index"
            },
            post: {
                handler: [controller.pageUpdate, controller.pageView],
                authenticate: true,
                permissions: "page_edit"
            }
        },
        "/blog/pages/:name": {
            get: {
                handler: controller.redirectToView,
                authenticate: true,
                permissions: "page_edit"
            }
        },

        /*
         * Defines route for add link menu
         * */
        "/blog/post/link/menu": {
            get: {
                handler: controller.link_menu_post,
                authenticate: true
            }
        },
        "/blog/page/link/menu": {
            get: {
                handler: controller.link_menu_page,
                authenticate: true
            }
        }
    }

};