
"use strict";

module.exports = function (sequelize, DataTypes) {
    let Role = sequelize.define("role", {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
            validate : {
                isInt : {
                    msg : 'Please input integer value'
                }
            }
        },
        name: {
            type : DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len : {
                    args : [1,255],
                    msg : 'please input not too long'
                }
            }
        },
        permissions: {
            type : DataTypes.TEXT
        },
        created_at: {
            type : DataTypes.DATE
        },
        created_by: {
            type : DataTypes.INTEGER,
            validate : {
                isInt : {
                    msg : 'Please input integer value'
                }
            }
        },
        modified_at: {
            type : DataTypes.DATE
        },
        modified_by: {
            type : DataTypes.INTEGER,
            validate : {
                isInt : {
                    msg : 'Please input integer value'
                }
            }
        },
        status: {
            type : DataTypes.STRING(15),
            validate : {
                isIn : {
                    args : [['publish', 'un-publish']],
                    msg : 'Please only input publish or un-publish'
                }
            }
        }

    }, {
        tableName: 'arr_role',
        createdAt: 'created_at',
        updatedAt: 'modified_at',
        deletedAt: false
    });
    return Role;
};