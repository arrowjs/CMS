"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("widget", {
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
        sidebar: DataTypes.STRING,
        data: DataTypes.TEXT,
        widget_name: DataTypes.STRING,
        ordering: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Ordering must be an integer'
                }
            }
        }
    }, {
        tableName: 'arr_widget',
        timestamps: false
    });
};
