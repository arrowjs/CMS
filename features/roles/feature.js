'use strict';

module.exports = {
    title: __('m_roles_backend_module_title'),
    author: 'Techmaster',
    version: '0.1.0',
    description: __('m_roles_backend_module_desc'),
    permissions: [
        {
            name: 'view',
            title: __('m_roles_backend_module_rules_index')
        },
        {
            name: 'create',
            title: __('m_roles_backend_module_rules_create')
        },
        {
            name: 'update',
            title: __('m_roles_backend_module_rules_update')
        },
        {
            name: 'delete',
            title: __('m_roles_backend_module_rules_delete')
        }
    ],
    backend_menu: {
        title: __('m_roles_backend_module_backend_menu_title'),
        icon: "fa fa-group",
        menus: [
            {
                permission: 'view',
                title: __('m_roles_backend_module_backend_menu_menus_index'),
                link: '/'
            },
            {
                permission: 'create',
                title: __('m_roles_backend_module_backend_menu_menus_create'),
                link: '/create'
            }
        ]
    }
};

