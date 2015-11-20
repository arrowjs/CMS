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
                handler: comp.postlist,
                authenticate: true,
                permissions: "post_index"
            },
            param: {
                key: "cid",
                handler: comp.postread
            }
        },
        "/blog/posts/page/:page": {
            get: {
                handler: comp.postlist,
                authenticate: true,
                permissions: "post_index"
            }
        },
        "/blog/posts/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: comp.postlist,
                authenticate: true,
                permissions: "post_index"
            }
        },
        "/blog/posts": {
            get: {
                handler: comp.postlist,
                authenticate: true,
                permissions: "post_index"
            },
            delete: {
                handler: comp.postdelete,
                authenticate: true,
                permissions: "post_delete"
            }
        },
        "/blog/posts/create": {
            get: {
                handler: comp.postcreate,
                authenticate: true,
                permissions: "post_create"
            },
            post: {
                handler: comp.postsave,
                authenticate: true,
                permissions: "post_create"
            }
        },
        "/blog/posts/:cid": {
            get: {
                handler: comp.postview,
                authenticate: true,
                permissions: "post_edit"
            },
            post: {
                handler: [comp.postupdate, comp.postview],
                authenticate: true,
                permissions: ["post_edit_all", "post_edit"]
            }
        },


        // route page

        "/blog/pages": {
            get: {
                handler: comp.pagelist,
                authenticate: true,
                permissions: "page_index"
            },
            delete: {
                handler: comp.pagedelete,
                authenticate: true,
                permissions: "page_delete"
            }
        },
        "/blog/pages/page/:page": {
            get: {
                handler: comp.pagelist,
                authenticate: true,
                permissions: "page_index"
            }
        },
        "/blog/pages/page/:page/sort/:sort/(:order)?": {
            get: {
                handler: comp.pagelist,
                authenticate: true,
                permissions: "page_index"
            }
        },
        "/blog/pages/create": {
            get: {
                handler: comp.pagecreate,
                authenticate: true,
                permissions: "page_create"
            },
            post: {
                handler: comp.pagesave,
                authenticate: true,
                permissions: "page_create"
            }
        },
        "/blog/pages/:cid([0-9]+)": {
            get: {
                handler: comp.pageview,
                authenticate: true,
                permissions: "page_edit"
            },
            post: {
                handler: [comp.pageupdate, comp.pageview],
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
        }

    }
};