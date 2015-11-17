//'use strict';
//
//let express = require('express');
//let router = express.Router();
//let index = require('./controllers/index.js');
//let themes = require('./controllers/themes.js');
//let moduleName = 'configurations';
//
//router.route('/configurations/site-info').get(__acl.isAllow( 'update_info'), index.index);
//router.route('/configurations/site-info').post(__acl.isAllow( 'update_info'), index.update_setting, index.index);
//router.route('/configurations/themes').get(__acl.isAllow( 'change_themes'), themes.index);
//router.route('/configurations/themes/:themeName').get(__acl.isAllow( 'change_themes'), themes.detail);
//router.route('/configurations/themes/:themeName').post(__acl.isAllow( 'change_themes'), themes.change_themes);
//router.route('/configurations/themes/import').get(__acl.isAllow( 'import_themes'), themes.import);
//router.route('/configurations/themes').delete(__acl.isAllow( 'delete_themes'), themes.delete);
//
//module.exports = router;
//

module.exports = function (component,application) {
    return {
        "/configuration/site-info" : {
            get : {
                handler : component.controllers.backend.index,
                permissions : "update_info"
            }
        },
        "/configuration/themes" : {
            get : {
                handler : component.controllers.backend.theme_index,
                permissions : "change_themes"
            }
        }
    }
};