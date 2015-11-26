/**
 * Created by thangnv on 11/25/15.
 */
'use strict';
let log = require('arrowjs').logger;
let promise = require('arrowjs').Promise;
/*
 * Function create user admin if not exist users
 * param :
 * app : is to get connection to database
 * callback : function return (null : if exist user)
 * */
exports.createUserAdmin = function (app, callback) {
    let permissions = app.permissions;
    try {
        permissions = delete permissions.widget;
        permissions = JSON.stringify(app.permissions);
    } catch (err) {
    }
    app.models.user.count()
        .then(function (count) {
            if (count < 1) {
                app.models.role.findAndCountAll({
                    limit: 1,
                    order: 'id DESC'
                }).then(function (result) {
                    if (result.count < 1) {
                        app.models.role.create({
                            name: 'Admin',
                            status: 'publish',
                            permissions: permissions
                        }).then(function (role) {
                            console.log('create role : ', role.id);
                            createUser(app, role.id, function (user) {
                                callback(user, role);
                            })
                        }).catch(function (err) {
                            callback(null);
                        })

                    } else {
                        createUser(app, result.rows[0].id, function (user) {
                            callback(user);
                        })
                    }
                })
                    .catch(function (err) {
                        log.error('Error At CreateUserAdmin in ArrowHelper function : ', err);
                        callback(null);
                    })
            } else {
                callback(null);
            }
        }).catch(function (err) {
            callback(null);
        })
}

function createUser(app, role_id, callback) {
    if (role_id < 1)
        callback(null);
    app.models.user.create({
        user_login: 'admin',
        user_pass: '123456',
        user_email: 'admin@example.com',
        user_url: 'https://facebook.com/...',
        user_status: 'publish',
        display_name: 'Administartor',
        image: '/img/admin.jpg',
        role_id: role_id,
        role_ids: role_id
    }).then(function (user) {
        callback(user);
    }).catch(function (err) {
        console.log(err);
        callback(err);
    })
}