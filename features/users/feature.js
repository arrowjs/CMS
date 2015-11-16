'use strict';

module.exports =  {
    title: t('m_users_backend_title'),
    author: 'Nguyen Van Thanh',
    version: '0.1.0',
    description: t('m_users_backend_description'),
    permistions: [
        {
            name: 'index',
            title: t('m_users_backend_rule_index')
        },
        {
            name: 'create',
            title: t('m_users_backend_rule_create')
        },
        {
            name: 'update',
            title: t('m_users_backend_rule_update')
        },
        {
            name: "update_profile",
            title: t('m_users_backend_rule_update_profile')
        },
        {
            name: 'delete',
            title: t('m_users_backend_rule_delete')
        }
    ],
    backend_menu: {
        title: t('m_users_backend_title'),
        icon: "fa fa-user",
        menus: [
            {
                rule: 'index',
                title: t('m_users_backend_rule_index'),
                link: '/'
            },
            {
                rule: 'create',
                title: t('m_users_backend_rule_create'),
                link: '/create'
            }
        ]
    }
}
