"use strict";

module.exports = {
    db: {
        host: 'localhost',
        port: '5432',
        database: 'arrowjs',
        username: 'postgres',
        password: '',
        dialect: 'postgres',
        logging: false
    },
    associate: function (models) {
        models.menu.hasMany(models.menu_detail, {foreignKey: 'menu_id'});
        models.menu_detail.belongsTo(models.menu, {foreignKey: 'menu_id'});
        models.user.belongsTo(models.role, {foreignKey: 'role_id'});
        models.role.hasMany(models.user, {foreignKey: 'role_id'});
        models.post.belongsTo(models.user, {foreignKey: "created_by"})
    }
};