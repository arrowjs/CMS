"use strict";

let getLayouts = require('./structureExtend').getWidgetLayouts;

module.exports = {
    feature: {
        path: {
            folder: '/features',
            file: 'feature.js'
        },
        extend: {
            system: true,
            active: true
        },
        action: {
            path: {
                folder: 'actions',
                file: '*.js'
            }
        },
        controller: [
            {
                path: {
                    name: 'backend',
                    folder: 'backend/controllers',
                    file: '*.js'
                }
            },
            {
                path: {
                    name: 'frontend',
                    folder: 'frontend/controllers',
                    file: '*.js'
                }
            }
        ],
        view: [
            {
                path: {
                    name: 'backend',
                    folder: [
                        '/themes/backend/:backendTheme/features/$component',
                        'backend/views',
                        '/themes/backend/:backendTheme/layouts'
                    ]
                }
            },
            {
                path: {
                    name: 'frontend',
                    folder: [
                        '/themes/frontend/:frontendTheme/features/$component',
                        'frontend/views',
                        '/themes/frontend/:frontendTheme/layouts'
                    ]
                }
            }
        ],
        model: {
            path: {
                folder: 'models',
                file: '*.js'
            }
        },
        route: [
            {
                path: {
                    'name': 'backend',
                    'folder': 'backend',
                    'file': 'route.js',
                    'prefix': '/admin'
                }
            },
            {
                path: {
                    'name': 'frontend',
                    'folder': 'frontend',
                    'file': 'route.js'
                }
            }
        ]
    },
    widget: {
        path: {
            folder: '/widgets',
            file: 'widget.js'
        },
        controller: {
            path: {
                folder: 'controllers',
                file: '*.js'
            }
        },
        view: {
            path: {
                folder: [
                    '/themes/frontend/:frontendTheme/widgets/$component',
                    'views'
                ]
            }
        },
        extend: {
            getLayouts: getLayouts
        }
    },
    plugin : {
        path: {
            folder: "/plugins",
            file: "plugin.js"
        },
        model : {
            path: {
                folder: 'models',
                file: '*.js'
            }
        },
        action: {
            path: {
                folder: 'actions',
                file: '*.js'
            }
        },
        route: {
            path: {
                file: 'route.js'
            }
        },
        controller: {
            path: {
                folder: 'controllers',
                file: '*.js'
            }
        },
        view: {
            path: {
                folder: "views"
            }
        }
    }
};