'use strict';

module.exports = {
    title: "Widget Manager",
    author: 'Techmaster',
    version: '0.1.0',
    description: "Backend Widget manager",
    permissions: [
        {
            name: 'index',
            title: 'Widget manager'
        }
    ],
    backend_menu: {
        title: 'Widgets',
        icon: 'fa fa-file-text',
        menus: {
            permission: 'index',
            title: 'Widget Manager',
            link: '/'
        }
    }
};

