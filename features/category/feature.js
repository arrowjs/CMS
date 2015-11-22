'use strict';

module.exports = {
    title: __('m_category_backend_module_title'),
    author: 'TechmasterVN',
    version: '0.0.1',
    description: __('m_category_backend_module_desc'),
    permissions: [
        {
            name: 'category_index',
            title: __('m_category_backend_module_category_index')
        },
        {
            name: 'category_create',
            title: __('m_category_backend_module_category_create')
        },
        {
            name: 'category_edit',
            title: __('m_category_backend_module_category_edit')
        },
        {
            name: 'category_delete',
            title: __('m_category_backend_module_category_delete')
        }
    ],
    backend_menu: {
        title: __('m_category_backend_module_title'),
        icon: 'fa fa-tags',
        menus:[
            {
                permission: 'index',
                title: 'category',
                link: 'categories#listAllCategories'
            }
        ]
    }

};

