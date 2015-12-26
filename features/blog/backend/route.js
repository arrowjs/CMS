'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component, application) {

    let controller = component.controllers.backend;
    let postPermissions = ['post_manage', 'post_manage_all'];
    let pagePermissions = ['page_manage', 'page_manage_all'];
    let categoryPermission = ['category_manage'];

    return {
        // Post
        "/blog": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: postPermissions
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
                permissions: postPermissions
            },
            delete: {
                handler: controller.postDelete,
                authenticate: true,
                permissions: postPermissions
            }
        },
        "/blog/posts/page/:page": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: postPermissions
            }
        },
        "/blog/posts/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.postList,
                authenticate: true,
                permissions: postPermissions
            }
        },
        "/blog/posts/create": {
            get: {
                handler: controller.postCreate,
                authenticate: true,
                permissions: postPermissions
            },
            post: {
                handler: [controller.postSave, controller.postCreate],
                authenticate: true,
                permissions: postPermissions
            }
        },
        "/blog/posts/:postId([0-9]+)": {
            get: {
                handler: controller.postView,
                authenticate: true,
                permissions: postPermissions
            },
            post: {
                handler: [controller.postUpdate, controller.postView],
                authenticate: true,
                permissions: postPermissions
            }
        },
        "/blog/posts/preview/:postId([0-9]+)": {
            get: {
                handler: controller.postPreview,
                authenticate: true,
                permissions: postPermissions
            }
        },
        "/blog/posts/autosave": {
            post: {
                handler: controller.postAutosave,
                authenticate: true,
                permissions: postPermissions
            }
        },
        // Page
        "/blog/pages": {
            get: {
                handler: controller.pageList,
                authenticate: true,
                permissions: pagePermissions
            },
            delete: {
                handler: controller.pageDelete,
                authenticate: true,
                permissions: pagePermissions
            }
        },
        "/blog/pages/page/:page": {
            get: {
                handler: controller.pageList,
                authenticate: true,
                permissions: pagePermissions
            }
        },
        "/blog/pages/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.pageList,
                authenticate: true,
                permissions: pagePermissions
            }
        },
        "/blog/pages/create": {
            get: {
                handler: controller.pageCreate,
                authenticate: true,
                permissions: pagePermissions
            },
            post: {
                handler: [controller.pageSave, controller.pageCreate],
                authenticate: true,
                permissions: pagePermissions
            }
        },
        "/blog/pages/:postId([0-9]+)": {
            get: {
                handler: controller.pageView,
                authenticate: true,
                permissions: pagePermissions
            },
            post: {
                handler: [controller.pageUpdate, controller.pageView],
                authenticate: true,
                permissions: pagePermissions
            }
        },
        "/blog/pages/preview/:postId([0-9]+)": {
            get: {
                handler: controller.pagePreview,
                authenticate: true,
                permissions: pagePermissions
            }
        },
        "/blog/pages/autosave": {
            post: {
                handler: controller.pageAutosave,
                authenticate: true,
                permissions: pagePermissions
            }
        },
        // Category
        "/blog/categories": {
            get: {
                handler: controller.categoryList,
                authenticate: true,
                permissions: categoryPermission
            },
            delete: {
                handler: controller.categoryDelete,
                authenticate: true,
                permissions: categoryPermission
            }
        },
        "/blog/categories/page/:page": {
            get: {
                handler: controller.categoryList,
                authenticate: true,
                permissions: categoryPermission
            }
        },
        "/blog/categories/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: controller.categoryList,
                authenticate: true,
                permissions: categoryPermission
            }
        },
        "/blog/categories/quick-create": {
            post: {
                handler: controller.categoryQuickCreate,
                authenticate: true,
                permissions: categoryPermission
            }
        },
        "/blog/categories/create": {
            get: {
                handler: controller.categoryCreate,
                authenticate: true,
                permissions: categoryPermission
            },
            post: {
                handler: [controller.categorySave, controller.categoryCreate],
                authenticate: true,
                permissions: categoryPermission
            }
        },
        "/blog/categories/:categoryId([0-9]+)": {
            get: {
                handler: controller.categoryView,
                authenticate: true,
                permissions: categoryPermission
            },
            post: {
                handler: [controller.categoryUpdate, controller.categoryView],
                authenticate: true,
                permissions: categoryPermission
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