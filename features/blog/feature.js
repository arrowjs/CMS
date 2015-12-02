'use strict';

module.exports = {
    title: "Blog",
    author: 'Techmaster',
    version: '0.1.0',
    description: __('m_blog_backend_module_desc'),
    permissions: [
        {
            name: 'post_index',
            title: __('m_blog_backend_module_post_index')
        },
        {
            name: 'post_create',
            title: __('m_blog_backend_module_post_create')
        },
        {
            name: 'post_edit',
            title: __('m_blog_backend_module_post_edit')
        },
        {
            name: 'post_edit_all',
            title: __('m_blog_backend_module_post_edit_all')
        },
        {
            name: 'post_delete',
            title: __('m_blog_backend_module_post_delete')
        },
        {
            name: 'page_index',
            title: __('m_blog_backend_module_page_index')
        },
        {
            name: 'page_create',
            title: __('m_blog_backend_module_page_create')
        },
        {
            name: 'page_edit',
            title: __('m_blog_backend_module_page_edit')
        },
        {
            name: 'page_edit_all',
            title: __('m_blog_backend_module_page_edit_all')
        },
        {
            name: 'page_delete',
            title: __('m_blog_backend_module_page_delete')
        }
    ],
    backend_menu: {
        title: __('m_blog_backend_module_menu_backend_menu_title'),
        icon: 'fa fa-newspaper-o',
        menus: [
            {
                permission: 'post_index',
                title: __('m_blog_backend_module_menu_backend_menu_post_index'),
                link: '/posts/page/1'
            },
            {
                permission: 'page_index',
                title: __('m_blog_backend_module_menu_backend_menu_page_index'),
                link: '/pages/page/1'
            }
        ]
    },
    //is define this module has link to shows on menu
    add_link_menu : {
        posts : {
            title : 'Link Posts',
            route : '/blog/post/link/menu',
            list : '/blog/posts',
            search : true
        },
        pages : {
            title : 'Link Pages',
            route : '/blog/page/link/menu',
            list : '/blog/pages',
            search : true
        }
    }
}

