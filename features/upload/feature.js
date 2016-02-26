'use strict';

module.exports = {
    title: __('m_upload_backend_module_title'),
    author: 'Nguyen Van Thanh',
    version: '0.1.1',
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

