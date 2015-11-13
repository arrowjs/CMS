"use strict";

module.exports = function (sequelize, DataTypes) {
    let Widget =  sequelize.define("widget", {
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
        sidebar: {
            type : DataTypes.STRING,
            validate : {
                isEven : function(value) {
                    if (typeof value != 'string'){
                        throw new Error('Please input string value')
                    }
                }
            }
        },
        data: {
            type : DataTypes.STRING,
            validate : {
                isEven : function(value) {
                    if (typeof value !== 'string'){
                        throw new Error('Please input string value')
                    }
                }
            }
        },
        created_at: {
            type : DataTypes.DATE
        },
        created_by: {
            type : DataTypes.INTEGER,
            allowNull : false,
            validate : {
                isInt : {
                    msg : 'please input integer value'
                }
            }

        },
        modified_at: {
            type : DataTypes.DATE
        } ,
        modified_by: {
            type : DataTypes.INTEGER,
            validate : {
                isInt : {
                    msg : 'please input integer value'
                }
            }

        },
        widget_type: {
            type : DataTypes.STRING,
            validate : {
                isEven : function(value) {
                    if (typeof value !== 'string'){
                        throw new Error('Please input string value')
                    }
                }
            }
        },
        ordering: {
            type : DataTypes.INTEGER,
            validate : {
                isInt : {
                    msg : 'please input integer value'
                }
            }
        }
    }, {
        tableName: 'arr_widget',
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "modified_at",
        deletedAt: false
    });
    Widget.sync();
    return Widget
};
