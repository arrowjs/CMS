'use strict';

module.exports = {
    title: __('m_menus_backend_module_title'),
    author: 'Nguyen Van Thanh',
    version: '0.0.1',
    description: __('m_menus_backend_module_desc'),
    permissions: [
        {
            name: 'index',
            title: __('m_menus_backend_module_rules_index')
        },
        {
            name: 'create',
            title: __('m_menus_backend_module_rules_create')
        },
        {
            name: 'update',
            title: __('m_menus_backend_module_rules_update')
        },
        {
            name: 'delete',
            title: __('m_menus_backend_module_rules_delete')
        }
    ],
    backend_menu: {
        title: __('m_menus_backend_module_backend_menu_title'),
        icon: "fa fa-bars",
        menus: [
            {
                permission: 'index',
                title: __('m_menus_backend_module_backend_menu_index'),
                link: '/'
            },
            {
                permission: 'create',
                title: __('m_menus_backend_module_backend_menu_create'),
                link: '/create'
            },
            {
                permission: 'update',
                title: __('m_menus_backend_module_backend_menu_update'),
                link: '/sort-admin-menu'
            }
        ]
    }
};

