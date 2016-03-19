'use strict';

module.exports = {
    title: __('m_users_backend_title'),
    author: 'Techmaster',
    version: '0.1.0',
    description: __('m_users_backend_description'),
    permissions: [
        {
            name: 'index',
            title: __('m_users_backend_rule_index')
        },
        {
            name: 'create',
            title: __('m_users_backend_rule_create')
        },
        {
            name: 'update',
            title: __('m_users_backend_rule_update')
        },
        {
            name: 'delete',
            title: __('m_users_backend_rule_delete')
        }
    ],
    backend_menu: {
        title: __('m_users_backend_title'),
        icon: "fa fa-user",
        menus: [
            {
                permission: 'index',
                title: __('m_users_backend_rule_index'),
                link: '/'
            },
            {
                permission: 'create',
                title: __('m_users_backend_rule_create'),
                link: '/create'
            }
        ]
    }
};
