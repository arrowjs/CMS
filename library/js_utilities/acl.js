/**
 * Created by thangnv on 11/14/15.
 */
'use strict';
let _ = require('arrowjs')._;
/*
 * @req : request from feature
 * @permission : permission for check
 * function return true or false
 * */
exports.isAllow = function (req,permission) {
    //get all permissions of current user
    let permissions = req.session.permissions;
    //get key of current feature
    let featureName =  req.arrowUrl.split('.').pop();
    let result = false;
    /*
     * check option of server.js
     * if role == false => return true (allows all permissions)
     * */
    if(!this.arrowSettings.role){
        return true;
    }
    //check permission is object (JSON)
    if (_.isObject(permissions)){
        if (_.has(permissions,'feature')){
            _.map(permissions.feature, function (v,k) {
                if (k === featureName){
                    permission = (typeof permission === 'string')?[permission]:permission;
                    _.map(permission, function (val) {
                        _.map(v, function (value) {
                            if(value['name']==val){
                                result = true;
                            }
                        })
                    })
                }
            })
        }
    }
    return result;
};

