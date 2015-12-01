"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("post", {
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
                },
                isTitle : function(value){
                    if(value.length == 0 || value.match(/[+-,$%^*();\/|<>"'\\]/g)){
                        throw new Error('Please input valid value title');
                    }
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
            defaultValue : '/img/noImage.png',
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
        categories: {
            type: DataTypes.TEXT
        },
        type: {
            type: DataTypes.STRING(15),
            len: {
                args: [1, 15],
                msg: 'Invalid data type'
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
        created_by: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Please input integer value'
                }
            },
            allowNull: false
        },
        modified_at: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Please input datetime value'
                }
            }
        },
        modified_by: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: 'Please input integer value'
                }
            }
        },
        author_visible: {
            type: DataTypes.BOOLEAN,
            isIn: {
                args: [['0', '1', 0, 1, true, false]],
                msg: 'Please input valid value of author_visible'
            }
        }
    }, {
        tableName: 'arr_post',
        createdAt: 'created_at',
        updatedAt: 'modified_at'
    });
};