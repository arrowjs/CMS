'use strict';

module.exports = {
    key: 'site_setting',
    app: {
        title: 'ArrowJS CMS',
        description: '',
        keywords: '',
        logo: '',
        icon: ''
    },
    long_stack: true,
    port: process.env.PORT || 8000,
    admin_prefix: 'admin',
    bodyParser: {
        extended: true,
        limit: '5mb'
    },
    ArrowHelper : "/library/js_utilities/helper/"
};