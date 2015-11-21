"use strict";

module.exports = function (sequelize, DataTypes) {
    let Widget = sequelize.define("widget", {
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
        data: DataTypes.STRING,
        widget_name: DataTypes.STRING,
        ordering: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Ordering must be an integer'
                }
            }
        },
        created_at: DataTypes.DATE,
        created_by: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Created by must be an integer'
                }
            }
        },
        modified_at: DataTypes.DATE,
        modified_by: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Modified by must be an integer'
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
    return Widget
};
