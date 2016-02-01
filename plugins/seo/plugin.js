'use strict';

module.exports = {
    title: 'SEO',
    author: 'Techmaster',
    version: '0.1.0',
    description: 'SEO plugin',
    dataType: 'json',
    onSave: '/admin/plugins/seo/save',
    pluginLocation: {
        head_tag: 'frontend_head'
    }
};

