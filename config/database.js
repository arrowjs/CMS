"use strict";


module.exports = {
    associate : function (models) {
        models.menus.hasMany(models.menu_detail,{ foreignKey: 'id'});
        models.menu_detail.belongsTo(models.menus,{ foreignKey: 'menu_id'});
        models.user.hasMany(models.role,{foreignKey : 'role_id'});
        models.role.belongsTo(models.user,{foreignKey : "role_id"})

    }
};