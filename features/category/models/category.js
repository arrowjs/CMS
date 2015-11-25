'use strict';

let slug = require('slug');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("category", {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
            validate: {
                isInt: {
                    msg: 'Count must be an integer number'
                }
            }
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate : {
                isInt : {
                    msg : 'Count must be an integer number'
                }
            }
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmp: function (value) {
                    if (typeof value !== 'string' || value.match(/[\ +-.,!@#$%^&*();\/|<>"'\\]/g)){
                        throw new Error('Alias cannot includes special characters!');
                    }
                }
            }
        },
        alias: {
            type :   DataTypes.STRING,
            validate : {
                isAlias : function (value) {
                    if (typeof value !== 'string' || value.match(/[\ +-.,!@#$%^&*();\/|<>"'\\]/g)){
                        throw new Error('Alias cannot includes special characters!');
                    }
                }
            }
        }
    }, {
        tableName: 'arr_category',
        timestamps: false,
        hooks: {
            beforeCreate: function (category, op, fn) {
                category.alias = slug(category.name).toLowerCase();
                fn(null, category);
            }
        }
    });
};