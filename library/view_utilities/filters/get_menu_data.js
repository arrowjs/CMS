'use strict';

module.exports = {
    handler: function (id, menus_data) {
        if (menus_data.length) {
            for (let i in menus_data) {
                if (id == menus_data[i].detail_id) {
                    return menus_data[i];
                }
            }
            return '';
        } else {
            return '';
        }
    }
};