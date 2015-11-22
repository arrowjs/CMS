"use strict";


module.exports = {
    associate : function (models) {
        models.menus.hasMany(models.menu_detail,{ foreignKey: 'id'});
        models.menu_detail.belongsTo(models.menus,{ foreignKey: 'menu_id'});
        models.user.belongsTo(models.role, {foreignKey: 'role_id'});
        models.role.hasMany(models.user, {foreignKey: 'role_id'});

        models.post.belongsTo(models.user,{foreignKey : "created_by"})
    }
};