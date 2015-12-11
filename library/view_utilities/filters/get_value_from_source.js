"use strict"
/**
 * Created by thanhnv on 2/28/15.
 */

module.exports =  {
    //Lay du lieu theo mang
    handler :  function (arr_value, source, key_compare, key_value) {
        let arr = [];
        for (let i in arr_value) {
            for (let y in source) {
                if (arr_value[i] == source[y][key_compare]) {
                    arr.push(source[y][key_value]);
                    break;
                }
            }
        }
        return arr.join(', ');
    }
}
