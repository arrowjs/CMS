/**
 * Created by thangnv on 12/10/15.
 */
'use strict';
module.exports = function (action,comp,app) {
    /*
    * params : type is json object
    * */
    action.findAll = function (params) {
        if (!params)params={};
        let offset = params.page || 0,
            limit = params.limit || 0,
            order = params.order || 'id desc',
            conditions = params['where'] || [' 1=1 '];
        return app.models.role.findAll({
            where : conditions,
            order : order,
            limit : limit,
            offset : offset
            })
            .then(function (result) {
                return result;
            })
            .catch(function (err) {
                log.error(err);
                return null;
            })
    }
}