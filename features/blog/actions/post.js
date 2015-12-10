/**
 * Created by thangnv on 12/10/15.
 */
"use strict";
let log = require('arrowjs').logger;
module.exports = function(action,comp,app){
    action.findById = function (id) {
        //return app.models.category.findById(id)
        //    .then(function (result) {
        //        return result
        //    })
        //    .catch(function (err) {
        //        log.error(err);
        //        return null;
        //    })
    };
    action.findAll = function (params) {
        let offset = params.page || 0,
            limit = params.limit || 0,
            order = params.order || 'id desc',
            conditions = params.conditions || [' 1=1 '];
        return app.models.post.findAll({
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
    };
    action.findAndCountAll = function (params) {
        if (!params)params={};
        let offset = params.page || 0,
            limit = params.limit || 0,
            order = params.order || 'id desc',
            conditions = params['where'] || [' 1=1 '];
        return app.models.post.findAndCountAll({
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
    action.count = function(params){
        if (!params)params={};
        let conditions = params['where'] || [' 1=1 '];
        return app.models.post.count({
            where : conditions
        })
            .then(function (result) {
                return result;
            })
            .catch(function (err) {
                log.error(err);
                return err;
            })
    };

}