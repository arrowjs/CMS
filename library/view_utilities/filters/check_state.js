"use strict";

module.exports ={
    handler : function (permissions, moduleName, action) {
        if(typeof permissions == 'object')
        if (permissions.hasOwnProperty('feature')){
            for (let i in permissions.feature) {
                if (permissions.feature.hasOwnProperty(i) && i == moduleName) {
                    for(let val of permissions.feature[i]){
                        if (val.name === action.name ){
                            return 'checked';
                        }
                    }
                }
            }
        }
        return '';
    }
}
