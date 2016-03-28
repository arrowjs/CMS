/**
 * Created by thangnv on 11/13/15.
 */
'use strict';

let _ = require('arrowjs')._,
    glob = require('glob'),
    fs = require('fs'),
    __ = require('./global'),
    util = require('util');

/**
 * Create breadcrumb
 * @param {array} root - Base breadcrumb
 * @returns {array} - Return new breadcrumb
 */
exports.createBreadcrumb = function (root) {
    let arr = root.slice(0);
    for (let i = 1; i < arguments.length; i++) {
        if (arguments[i] != undefined)
            arr.push(arguments[i]);
    }
    return arr;
};

/**
 * Add active class to current menu
 * @param {string} value - Menu link
 * @param {string} string_to_compare - String to compare with menu link
 * @param {string} css_class - CSS class when not use class "active"
 * @param {integer} index
 * @returns {string}
 */
exports.active_menu = function (value, string_to_compare, css_class, index) {
    let arr = value.split('/');
    let st = "active";

    if (css_class) {
        st = css_class;
    }

    if (string_to_compare == '') {
        string_to_compare = 'index';
    }

    if (~string_to_compare.indexOf('/')) {
        string_to_compare = string_to_compare.split('/')[index];
    }

    if (index) {
        let v = arr[index];
        if (!v) {
            v = "index";
        }
        return v === string_to_compare ? st : "";
    }

    return arr[2] == string_to_compare ? st : "";
};

/**
 * Sort menu by "sort" property
 * @param {object} menus
 * @returns {array}
 */
exports.sortMenus = function (menus) {
    let sortable = [];

    // Add menus to array
    for (let m in menus) {
        if (menus.hasOwnProperty(m)) {
            sortable.push({menu: m, sort: menus[m].sort});
        }
    }

    // Sort menu array
    sortable.sort(function (a, b) {
        if (a.sort < b.sort)
            return -1;
        if (a.sort > b.sort)
            return 1;
        return 0;
    });

    return sortable;
};

/**
 * Create Environment to handles templates
 * @param {array} views - List of loaders
 * @returns {object}
 */
exports.createNewEnv = function (views) {
    let nunjucks = require('nunjucks');
    let env;

    if (views) {
        env = new nunjucks.Environment(new nunjucks.FileSystemLoader(views));
    } else {
        env = new nunjucks.Environment(new nunjucks.FileSystemLoader([__base + 'core/widgets', __base + 'app/widgets', __base + 'themes/frontend']));
    }

    env = __.getAllCustomFilter(env);
    env = __.getAllGlobalVariable(env);

    return env;
};

/**
 * Add custom filter to Environment
 * @param {object} env - Environment to add custom filter
 * @returns {object}
 */
exports.getAllCustomFilter = function (env) {
    let custom_filters = __.getOverrideCorePath(__base + 'core/custom_filters/*.js', __base + 'app/custom_filters/*.js', 1);

    for (let index in custom_filters) {
        if (custom_filters.hasOwnProperty(index)) {
            require(custom_filters[index])(env);
        }
    }

    return env;
};

/**
 * Add global variables to Environment
 * @param {object} env - Environment to add global variable
 * @returns {object}
 */
exports.getAllGlobalVariable = function (env) {
    env.addGlobal('create_link', function (module_name, link) {
        return module_name + '/' + link;
    });
    return env;
};

/**
 * Parse query conditions with column type
 * @param {string} column_name
 * @param {string} value
 * @param {string} col
 * @returns {string}
 */
exports.parseCondition = function (column_name, value, col) {
    if (col.filter.filter_key) {
        column_name = col.filter.filter_key;
    }

    column_name = (col.filter.model ? (col.filter.model + '.') : '') + column_name;
    column_name = column_name.replace(/(.*)\.(.*)/, '"$1"."$2"');

    if (col.filter.data_type == 'array') {
        return column_name + ' @> ?';
    } else if (col.filter.data_type == 'string') {
        return column_name + ' ilike ?';
    } else if (col.filter.data_type == 'datetime') {
        return column_name + " between ?::timestamp and ?::timestamp";
    } else {
        if (~value.indexOf('><') || col.filter.type == 'datetime') {
            return column_name + " between ? and ?";
        } else if (~value.indexOf('<>')) {
            return column_name + " not between ? and ?";
        } else if (~value.indexOf('>=')) {
            return column_name + " >= ?";
        } else if (~value.indexOf('<=')) {
            return column_name + " <= ?";
        } else if (~value.indexOf('<')) {
            return column_name + " < ?";
        } else if (~value.indexOf('>')) {
            return column_name + " > ?";
        } else if (~value.indexOf(';')) {
            return column_name + " in (?)";
        } else {
            return column_name + " = ?";
        }
    }
};

/**
 * Parse value with data type
 * @param {string} value
 * @param {object} col
 * @returns {string}
 */
exports.parseValue = function (value, col) {
    if (col.filter.data_type == 'array') {
        return '{' + value + '}';
    }

    if (col.filter.data_type == 'datetime') {
        return value.split(/\s+-\s+/);
    } else if (col.filter.data_type == 'string') {
        value = "%" + value + "%";
    } else if (col.filter.data_type == 'bytes') {
        let match = /([0-9]+)\s*(.*)/g.exec(value);
        if (match) {
            let unit = match[2];
            value = match[1];

            switch (unit.toLowerCase()) {
                case "kb":
                    value = value * 1000;
                    break;
                case 'mb':
                    value = value * 1000 * 1000;
                    break;
                case "gb":
                    value = value * 1000 * 1000 * 1000;
                    break;
            }
            return value;
        }
    }

    if (~value.indexOf('><')) {
        return value.split('><');
    } else if (~value.indexOf('<>')) {
        return value.split('<>');
    } else {
        return value.replace(/[><]/g, "");
    }
};

/**
 * Convert filter values to String (use in raw query)
 * @param {Array} filterValues - Values of filter which created by createFilter
 * @returns {string}
 */
exports.toRawFilter = function (filterValues) {
    let conditions = filterValues[0].split('?');
    for (let i = 0; i < conditions.length - 1; i++) conditions[i] += "'" + filterValues[i + 1] + "'";
    return conditions.join('');
};

/**
 * Generate random string from possible string
 * @param {integer} length - Length of random string
 * @returns {string}
 */
exports.randomSalt = function (length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

/**
 * Send mail with provided options
 * @param {object} mailOptions
 * @returns {Promise}
 */
exports.sendMail = function (mailOptions) {
    return new Promise(function (fulfill, reject) {
        __mailSender.sendMail(mailOptions, function (err, info) {

            if (err) {
                reject(err);
            } else {
                fulfill(info);
            }
        });
    });
};

/**
 * Check security of file by regex
 * @param {string} file_path
 * @returns {object}
 */
exports.checkFileSecurity = function (file_path) {
    let content = fs.readFileSync(file_path).toString();
    let result = {};

    // Check file activities
    let fileCheck = [
        "readFile",
        "readFileSync"
    ];
    let fileCheckRegex = new RegExp(fileCheck.join('|'), 'g');
    if (content.match(fileCheckRegex) != null) {
        result.file_activities = "Read files";
    }

    // Check database activities
    let databaseCheck = [
        "__models"
    ];
    let databaseCheckRegex = new RegExp(databaseCheck.join('|'), 'g');
    if (content.match(databaseCheckRegex) != null) {
        result.database_activities = "Connect database";
    }

    // Set file path
    if (result.hasOwnProperty('file_activities') || result.hasOwnProperty('database_activities')) {
        result.file_path = file_path.replace(__base + 'app/', '');
    }

    return result;
};

/**
 * Check security of all file in directory
 * @param {string} path
 * @param {Array} result
 * @returns {boolean}
 */
exports.checkDirectorySecurity = function (path, result) {
    try {
        let files = fs.readdirSync(path);

        if (files.length > 0) {
            files.forEach(function (file) {
                let file_path = path + '/' + file;

                if (fs.lstatSync(file_path).isDirectory()) {
                    __.checkDirectorySecurity(file_path, result);
                } else {
                    result.push(__.checkFileSecurity(file_path));
                }
            });
        }
    } catch (ex) {
        return false;
    }
};

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function (globPatterns, removeRoot) {
    // For context switching
    let _this = this;

    // URL paths regex
    let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    let output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            glob(globPatterns, {
                sync: true
            }, function (err, files) {
                if (removeRoot) {
                    files = files.map(function (file) {
                        return file.replace(removeRoot, '');
                    });
                }

                output = _.union(output, files);
            });
        }
    }

    return output;
};

/**
 * Replace paths with same name in "checkIndex" position (calculate from end string when split with "/")
 */
module.exports.overrideCorePath = function (paths, routePath, checkIndex) {
    let arr_path = routePath.split('/');
    let checkName = arr_path[arr_path.length - checkIndex];

    let check_obj = {};
    check_obj[checkName] = routePath;

    _.assign(paths, check_obj);
    return paths;
};

/**
 * Replace core paths with app paths if they have same name in "checkIndex" position using overrideCorePath
 */
module.exports.getOverrideCorePath = function (corePath, appPath, checkIndex) {
    let paths = [];

    __.getGlobbedFiles(corePath).forEach(function (routePath) {
        paths = __.overrideCorePath(paths, routePath, checkIndex);
    });

    __.getGlobbedFiles(appPath).forEach(function (routePath) {
        paths = __.overrideCorePath(paths, routePath, checkIndex);
    });

    return paths
};

/**
 * Merge all path in same directory
 */
module.exports.mergePath = function (paths, routePath, checkIndex) {
    let arr_path = routePath.split('/');
    let checkName = arr_path[arr_path.length - checkIndex];

    if (paths.hasOwnProperty(checkName)) {
        paths[checkName].push(routePath);
    } else {
        paths[checkName] = [routePath];
    }

    return paths;
};