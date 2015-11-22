'use strict';

/**
 * Map final part of URL to equivalent functions in controller
 */
module.exports = function (component, application) {
	let comp = component.controllers.backend;
    return {
        "/categories": {
        	get: {
        		handler: comp.category_list,
        		authenticate: true,
        		permissions: "category_index"
        	},
        	delete: {
        		handler: comp.category_delete,
        		authenticate: true,
        		permissions: "category_delete"
        	}
        },
        "/categories/page/:page": {
        	get: {
        		handler: comp.category_list,
        		authenticate: true,
        		permissions: "category_index"
        	}
        },
        "/categories/page/:page/sort/:sort/(:order)?": {
        	get: {
        		handler: comp.category_list,
        		authenticate: true,
        		permissions: "category_index"
        	}
        },
        "/categories/create": {
        	post: {
        		handler: comp.category_save,
        		authenticate: true,
        		permissions: "category_create"
        	}
        },
        "/categories/:catId": {
        	post: {
        		handler: comp.category_update,
        		authenticate: true,
        		permissions: "category_edit"
        	}
        }
    }
};