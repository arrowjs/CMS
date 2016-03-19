'use strict';

module.exports = {
    title: __('m_configurations_backend_module_title'),
    author: 'Techmaster',
    version: '0.1.0',
    description: __('m_configurations_backend_module_desc'),
    permissions: [
        {
            name: 'update_info',
            title: __('m_configurations_backend_module_rules_update_info')
        },
        {
            name: 'change_theme',
            title: __('m_configurations_backend_module_rules_change_themes')
        },
        {
            name: 'import_theme',
            title: __('m_configurations_backend_module_rules_import_themes')
        },
        {
            name: 'delete_theme',
            title: __('m_configurations_backend_module_rules_delete_themes')
        }
    ],
    backend_menu: {
        title: __('m_configurations_backend_module_backend_menu_title'),
        icon: "fa fa-cog",
        menus: [
            {
                permission: 'update_info',
                title: __('m_configurations_backend_module_backend_menu_update_info'),
                link: '/site-info'
            },
            {
                permission: 'change_theme',
                title: __('m_configurations_backend_module_backend_menu_change_themes'),
                link: '/themes'
            }
        ]
    }
};


