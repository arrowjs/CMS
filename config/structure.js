module.exports = {
    feature: {
        "path": {
            "folder": "/features",
            "file": "feature.js"
        },
        "controller": [
            {
                "path": {
                    "name": "backend",
                    "folder": "backend/controllers",
                    "file": "*.js"
                }
            },
            {
                "path": {
                    "name": "frontend",
                    "folder": "frontend/controllers",
                    "file": "*.js"
                }
            }
        ],
        "view": [
            {
                "path": {
                    "name": "backend",
                    "folder": [
                        "/themes/backend/:theme/features/$component",
                        "backend/views",
                        "/themes/backend/:theme/layout"
                    ]
                }
            },
            {
                "path": {
                    "name": "frontend",
                    "folder": [
                        "/themes/frontend/:theme/features/$component",
                        "frontend/views",
                        "/themes/frontend/:theme/layout"
                    ]
                }
            }
        ],
        "model": {
            "path": {
                "folder": "models",
                "file": "*.js"
            }
        },
        "route": [
            {
                "path": {
                    "name": "backend",
                    "folder": "backend",
                    "file": "route.js",
                    "prefix": "/admin"
                }
            },
            {
                "path": {
                    "name": "frontend",
                    "folder": "frontend",
                    "file": "route.js"
                }
            }
        ]
    },
    widget: {
        "path": {
            "folder": "/widgets",
            "file": "widget.js"
        },
        "controller": {
            "path": {
                "folder": "controllers",
                "file": "*.js"
            }
        },
        "view": {
            "path": {
                "folder": "views"
            }
        },
        "extends" : {
            "getLayouts": function (widget) {
                // Get all widget layouts
                console.log("\x1b[32m", "Widget: Get all layouts", "\x1b[0m");
            }
        }
    }
};