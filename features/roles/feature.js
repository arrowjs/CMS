/**
 * Created by thangnv on 11/12/15.
 */
'use strict';

module.exports = {
        title: t('m_roles_backend_module_title'),
        author: 'Nguyen Van Thang',
        version: '0.1.0',
        description: t('m_roles_backend_module_desc'),
        permistions: [
            {
                name: 'index',
                title: t('m_roles_backend_module_rules_index')
            },
            {
                name: 'create',
                title: t('m_roles_backend_module_rules_create')
            },
            {
                name: 'update',
                title: t('m_roles_backend_module_rules_update')
            },
            {
                name: 'delete',
                title: t('m_roles_backend_module_rules_delete')
            }
        ],
        backend_menu: {
            title: t('m_roles_backend_module_backend_menu_title'),
            icon: "fa fa-group",
            menus: [
                {
                    rule: 'index',
                    title: t('m_roles_backend_module_backend_menu_menus_index'),
                    link: '/'
                },
                {
                    rule: 'create',
                    title: t('m_roles_backend_module_backend_menu_menus_create'),
                    link: '/create'
                }
            ]
        }
    };

