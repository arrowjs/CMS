/**
 * Created by thangnv on 11/24/15.
 */

'use strict';
module.exports = {
    handler : function (id, _menus_data) {
        for (let i in _menus_data) {
            if (id == _menus_data[i].detail_id) {
                return _menus_data[i];
            }
        }
    }
}