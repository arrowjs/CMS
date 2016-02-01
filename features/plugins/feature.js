'use strict';

module.exports = {
    title: "Plugin Manager",
    author: 'Techmaster',
    version: '0.1.0',
    description: "Backend Plugin manager",
    permissions: [
        {
            name: 'index',
            title: 'Plugin manager'
        }
    ],
    backend_menu: {
        title: 'Plugins',
        icon: 'fa fa-file-text',
        menus: {
            permission: 'index',
            title: 'Plugin Manager',
            link: '/'
        }
    }
};

