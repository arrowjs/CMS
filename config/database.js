"use strict";


module.exports = {
    associate : function (models) {
        models.menu.hasMany(models.menu_detail,{ foreignKey: 'menu_id'});
        models.menu_detail.belongsTo(models.menu,{ foreignKey: 'menu_id'});
        models.user.belongsTo(models.role, {foreignKey: 'role_id'});
        models.role.hasMany(models.user, {foreignKey: 'role_id'});

        models.post.belongsTo(models.user,{foreignKey : "created_by"})
    }
};