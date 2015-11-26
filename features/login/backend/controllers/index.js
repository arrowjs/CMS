/**
 * Created by thangnv on 11/11/15.
 */
'use strict';

module.exports = function (cont, comp, app) {
    cont.view = function (req, res) {
        res.backend.render('login');
    };

    cont.logout = function (req, res) {
        req.logout();
        res.redirect('/admin/login');
    };

    cont.notPermission = function (req, res) {
        res.backend.render('_403');
    }
};