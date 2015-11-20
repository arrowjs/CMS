"use strict";

module.exports = function (sequelize, DataTypes) {
    let Posts = sequelize.define("post", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                isInt: {
                    msg: 'ID must be an integer number'
                }
            }
        },
        title: {
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
            type: DataTypes.STRING(255),
            unique: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Alias is too long'
                }
            }
        },
        intro_text: DataTypes.TEXT,
        full_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(255),
            len: {
                args: [0, 255],
                msg: 'Image is too long'
            }
        },
        published: {
            type: DataTypes.INTEGER,
            validate: {
                isIn: {
                    args: [['0', '1']],
                    msg: 'Invalid data type'
                }
            }

        },
        published_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Please input datetime value'
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Please input datetime value'
                }
            }
        },
        modified_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Please input datetime value'
                }
            }
        }
    }, {
        tableName: 'arr_post',
        createdAt: 'created_at',
        updatedAt: 'modified_at'
    });

    Posts.sync();
    return Posts;
};