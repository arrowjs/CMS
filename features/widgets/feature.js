'use strict';

module.exports = {
    title: "Widget Manager",
    author: 'Techmaster',
    version: '0.1.0',
    description: "Backend Widget manager",
    backend_menu: {
        title: __('m_widgets_backend_module_menu_title'),
        icon: 'fa fa-file-text',
        menus: [
            {
                permission: 'index',
                title: __('m_widgets_backend_module_menus_index_sidebars'),
                link: '/sidebars'
            },
            {
                permission: 'index',
                title: __('m_widgets_backend_module_menus_index_widgets'),
                link: '/'
            }
        ]
    }
};

