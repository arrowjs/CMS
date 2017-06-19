"use strict";

/**
 * @exports config/database
 */
module.exports = {
    db: {
        host: 'localhost',
        port: '5432',
        database: '', //db_name
        username: '', //db_username
        password: '', //db_password
        dialect: 'postgres',
        logging: false
    },

    /** Developer defines logic to associate models.<br>
        For example
     <pre><code>models.post.belongsTo(models.user, {foreignKey: "created_by"})
models.role.hasMany(models.user, {foreignKey: 'role_id'});</code></pre> */
    associate : function (models) {

    }
};