"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("plugin", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                isInt: {
                    msg: 'ID must be an integer'
                }
            }
        },
        plugin_name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        data: DataTypes.TEXT,
        active : DataTypes.BOOLEAN,
        ordering: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Ordering must be an integer'
                }
            }
        }
    }, {
        tableName: 'arr_plugin',
        timestamps: false
    });
};
