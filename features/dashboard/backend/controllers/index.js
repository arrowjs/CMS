/**
 * Created by thangnv on 11/11/15.
 */
'use strict'

module.exports = function (cont,comp,app) {
    cont.view = function (req, res) {
        res.backend.render('index',{
            user : req.user
        });
    };
}