"use strict";

module.exports ={
    handler : function (rules, moduleName, action) {
        if(typeof rules == 'object')
        if (rules.hasOwnProperty('feature')){
            for (let i in rules.feature) {
                if (rules.feature.hasOwnProperty(i) && i == moduleName) {
                    for(let val of rules.feature[i]){
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
