/**
 * Created by thangnv on 11/14/15.
 */
'use strict';

/*
* @req : request from feature
* @permission : permission for check
* function return true or false
* */
exports.isAllow = function (req,permission) {
    let permissions = req.session.permissions;
    let featureName =  req.arrowUrl.split('.').pop();
    if(!this.arrowSettings.role){
        return true;
    }
    if (typeof permissions === 'object'){
        if (permissions.hasOwnProperty('feature')){
            for (let k in permissions.feature){
                if (k === featureName){
                    for(let val of permissions.feature[k]){
                        if (val.name === permission){
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
};

