'use strict';

module.exports = {
    title: "Blog",
    author: 'Techmaster',
    version: '0.1.0',
    description: __('m_blog_backend_module_desc'),
    permissions: [
        // Post
        {
            name: 'post_manage',
            title: 'Manage own posts'
        },
        {
            name: 'post_manage_all',
            title: 'Manage all posts'
        },
        // Page
        {
            name: 'page_manage',
            title: 'Manage own pages'
        },
        {
            name: 'page_manage_all',
            title: 'Manage all pages'
        },
        // Category
        {
            name: 'category_manage',
            title: 'Manage categories'
        }
    ],
    backend_menu: {
        title: __('m_blog_backend_module_menu_backend_menu_title'),
        icon: 'fa fa-newspaper-o',
        menus: [
            {
                permission: "post_manage",
                title: __('m_blog_backend_module_menu_backend_menu_post_index'),
                link: '/posts/page/1'
            },
            {
                permission: 'page_manage',
                title: __('m_blog_backend_module_menu_backend_menu_page_index'),
                link: '/pages/page/1'
            },
            {
                permission: 'category_manage',
                title: "Categories",
                link: '/categories/page/1'
            }
        ]
    },
    // Define this module has link to shows on menu
    add_link_menu: {
        posts: {
            title: 'Link Posts',
            route: '/blog/post/link/menu',
            list: '/blog/posts',
            search: true
        },
        pages: {
            title: 'Link Pages',
            route: '/blog/page/link/menu',
            list: '/blog/pages',
            search: true
        }
    }

};

