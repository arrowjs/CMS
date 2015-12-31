"use strict"
/**
 * Created by thanhnv on 2/28/15.
 */

module.exports =  {
    //Lay du lieu theo mang
    handler: function (value, source, key_compare, key_value) {
        if (typeof(source) == "string") {
            source = JSON.parse(source);
        }
        for (let y in source) {
            if (value == source[y][key_compare]) {
                return source[y][key_value];
            }
        }
        return "";
    }
}
