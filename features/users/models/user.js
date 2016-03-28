'use strict';

let crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_pass: {
            type: DataTypes.STRING(255),
            validate: {
                notEmpty: true
            }
        },
        user_email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Invalid email address'
                }
            }
        },
        user_registered: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('now')
        },
        user_activation_key: {
            type: DataTypes.STRING(60),
            validate: {
                len: {
                    args: [0, 60],
                    msg: 'Please don\'t input too long'
                }
            }
        },
        user_status: {
            type: DataTypes.STRING(15),
            validate: {
                isIn: {
                    args: [['publish', 'un-publish']],
                    msg: 'Invalid data value'
                }
            }
        },
        display_name: {
            type: DataTypes.STRING(250),
            validate: {
                len: {
                    args: [1, 250],
                    msg: 'Display name cannot empty or exceed 250 characters'
                }
            }
        },
        user_image_url: {
            type: DataTypes.STRING(1000),
            defaultValue: '/img/noImage.png'
        },
        salt: DataTypes.STRING(255),
        role_id: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'ID must be a number'
                }
            }
        },
        role_ids: {
            type: DataTypes.STRING
        },
        reset_password_expires: {
            type: DataTypes.BIGINT
        },
        reset_password_token: {
            type: DataTypes.STRING
        },
        change_email_expires: {
            type: DataTypes.BIGINT
        },
        change_email_token: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        tableName: 'arr_user',
        instanceMethods: {
            authenticate: function (password) {
                return this.user_pass === this.hashPassword(password);
            },
            hashPassword: function (password) {
                if (this.salt && password) {
                    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
                } else {
                    return password;
                }
            }
        },
        hooks: {
            beforeCreate: function (user, op, fn) {
                user.salt = randomid(50);
                user.user_pass = user.hashPassword(user.user_pass);
                fn(null, user);
            }
        }
    });
};

let randomid = function (length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};