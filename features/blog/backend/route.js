'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component, application) {
    let comp = component.controllers.backend;
    return {
        // route post
        "/blog": {
            get: {
                handler: comp.postList,
                authenticate: true,
                permissions: "post_index"
            },
            param: {
                key: "cid",
                handler: comp.postRead
            }
        },
        "/blog/posts/page/:page": {
            get: {
                handler: comp.postList,
                authenticate: true,
                permissions: "post_index"
            }
        },
        "/blog/posts/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: comp.postList,
                authenticate: true,
                permissions: "post_index"
            }
        },
        "/blog/posts": {
            get: {
                handler: comp.postList,
                authenticate: true,
                permissions: "post_index"
            },
            delete: {
                handler: comp.postDelete,
                authenticate: true,
                permissions: "post_delete"
            }
        },
        "/blog/posts/create": {
            get: {
                handler: comp.postCreate,
                authenticate: true,
                permissions: "post_create"
            },
            post: {
                handler: [comp.postSave,comp.postCreate],
                authenticate: true,
                permissions: "post_create"
            }
        },
        "/blog/posts/:cid": {
            get: {
                handler: comp.postView,
                authenticate: true,
                permissions: "post_index"
            },
            post: {
                handler: [comp.postUpdate, comp.postView],
                authenticate: true,
                permissions: ["post_edit_all", "post_edit"]
            }
        },"/blog/posts/preview/:postId([0-9]+)": {
            get: {
                handler: comp.postPreview,
                authenticate: true,
                permissions: "post_index"
            }
        },



        // route page

        "/blog/pages": {
            get: {
                handler: comp.pageList,
                authenticate: true,
                permissions: "page_index"
            },
            delete: {
                handler: comp.pageDelete,
                authenticate: true,
                permissions: "page_delete"
            }
        },
        "/blog/pages/page/:page": {
            get: {
                handler: comp.pageList,
                authenticate: true,
                permissions: "page_index"
            }
        },
        "/blog/pages/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: comp.pageList,
                authenticate: true,
                permissions: "page_index"
            }
        },
        "/blog/pages/create": {
            get: {
                handler: comp.pageCreate,
                authenticate: true,
                permissions: "page_create"
            },
            post: {
                handler: [comp.pageSave,comp.pageCreate],
                authenticate: true,
                permissions: "page_create"
            }
        },
        "/blog/pages/:cid([0-9]+)": {
            get: {
                handler: comp.pageView,
                authenticate: true,
                permissions: "page_index"
            },
            post: {
                handler: [comp.pageUpdate, comp.pageView],
                authenticate: true,
                permissions: "page_edit"
            }
        },
        "/blog/pages/:name": {
            get: {
                handler: comp.redirectToView,
                authenticate: true,
                permissions: "page_edit"
            }
        },


        /*
        * Defines route for add link menu
        * */
        "/blog/post/link/menu" : {
            get : {
                handler : comp.link_menu_post,
                authenticate : true
            }
        },
        "/blog/page/link/menu" : {
            get : {
                handler : comp.link_menu_page,
                authenticate : true
            }
        }

    }
};