'use strict';

module.exports = function (sequelize, DataTypes) {

    return sequelize.define("post", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Title cannot too long'
                }
            }
        },
        alias: {
            type: DataTypes.STRING,
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
        categories: DataTypes.TEXT,
        intro_text: DataTypes.TEXT,
        full_text: DataTypes.TEXT,
        image: {
            type: DataTypes.STRING,
            defaultValue: '/img/noImage.png',
            len: {
                args: [0, 255],
                msg: 'Image name is too long'
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
        type: {
            type: DataTypes.STRING,
            validate: {
                isSlug: function (value) {
                    if (typeof value !== 'string' || !value.match(/[a-zA-Z0-9-_]/g)) {
                        throw new Error('Type cannot includes special characters!');
                    }
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Invalid date value'
                }
            }
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        modified_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Invalid date value'
                }
            }
        },
        modified_by: {
            type: DataTypes.INTEGER
        },
        author_visible: {
            type: DataTypes.BOOLEAN,
            isIn: {
                args: [['0', '1', 0, 1, true, false]],
                msg: 'Invalid boolean value'
            }
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['alias', 'type']
            }
        ],
        tableName: 'arr_post',
        createdAt: 'created_at',
        updatedAt: 'modified_at'
    });

};