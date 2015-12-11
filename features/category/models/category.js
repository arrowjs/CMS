'use strict';

module.exports = function (sequelize, DataTypes) {

    return sequelize.define("category", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 255],
                    msg: 'Title cannot empty or too long'
                }
            }
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 255],
                    msg: 'Alias cannot empty or too long'
                },
                isSlug: function (value) {
                    if (typeof value !== 'string' || !value.match(/[a-zA-Z0-9-_]/g)) {
                        throw new Error('Alias cannot includes special characters!');
                    }
                }
            }
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isSlug: function (value) {
                    if (typeof value !== 'string' || !value.match(/[a-zA-Z0-9-_]/g)) {
                        throw new Error('Type cannot includes special characters!');
                    }
                }
            }
        },
        description: DataTypes.TEXT,
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: {
                    msg: 'Count must be an integer number'
                }
            }
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['name', 'type']
            },
            {
                unique: true,
                fields: ['alias', 'type']
            }
        ],
        tableName: 'arr_category',
        timestamps: false
    });

};