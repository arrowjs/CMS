'use strict';

module.exports = {
    title: __('m_upload_backend_module_title'),
    author: 'Techmaster',
    version: '0.1.0',
    description: __('m_upload_backend_module_desc'),
    permissions: [
        {
            name: 'upload_manage',
            title: 'Manage files'
        },
        {
            name: 'upload_manage_all',
            title: 'Manage all files'
        }
    ]
};

