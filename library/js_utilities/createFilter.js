'use strict';

let _ = require('arrowjs')._;
let logger = require('arrowjs').logger;

exports.createFilter = function (req, res, columns, options) {
    let customCondition;
    let limit;
    let current_column = req.params.sort || columns[0].column || "id";
    let order = req.params.order || 'DESC';
    let page = req.params.page || 1;

    if (options) {
        limit = options.limit || 10;
        customCondition = options.customCondition;

        if (options.rootLink) {
            res.locals.root_link = options.rootLink.replace("$page", page);
        }

        if (options.backLink) {
            req.session.search = req.session.search || {};
            req.session.search[options.backLink] = req.originalUrl;
        }
    }

    let conditions = [];
    let values = [];
    let attributes = [];
    values.push('command');

    let getColumn = function (name) {
        if (_.isArray(columns)) {
            return _.find(columns, function (col) {
                    return col.column === name
                }) || {filter: {}}
        } else {
            logger.err("Wrong parameter");
        }
    };

    Object.keys(req.query)
        .filter(function (key) {
            return req.query[key] !== '' && getColumn(key)
        })
        .map(function (i) {
            let col = getColumn(i);
            if (col.query) {
                conditions.push(col.query);
            } else {
                conditions.push(parseCondition(i, req.query[i], col));
            }

            let value = parseValue(req.query[i], col);
            if (_.isArray(value)) {
                for (let y in value) {
                    values.push(value[y].trim());
                }
            } else {
                values.push(value.trim());
            }
        });

    for (let i in columns) {
        if (columns[i].column != '') attributes.push(columns[i].column);
    }

    let tmp = conditions.length > 0 ? "(" + conditions.join(" AND ") + ")" : " 1=1 ";
    values[0] = tmp + (customCondition ? customCondition : '');

    res.locals.table_columns = columns;
    res.locals.currentColumn = current_column;
    res.locals.currentOrder = order;
    res.locals.filters = req.query;
    res.locals.currentPage = page;

    if (current_column.indexOf('.') > -1) current_column = current_column.replace(/(.*)\.(.*)/, '"$1"."$2"');

    return {
        order: current_column + " " + order,
        limit: limit,
        offset: (page - 1) * limit,
        conditions: values
    };
};

function parseCondition(column_name, value, col) {
    if (col.filter.filter_key) {
        column_name = col.filter.filter_key;
    }

    column_name = (col.filter.model ? (col.filter.model + '.') : '') + column_name;
    column_name = column_name.replace(/(.*)\.(.*)/, '"$1"."$2"');

    if (col.filter.data_type == 'number' && isNaN(Number(value))) {
       return false;
    } else if (col.filter.data_type == 'array') {
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
}

function parseValue(value, col) {

    if (col.filter.data_type == 'array') {
        return '{' + value + '}';
    }

    if (col.filter.data_type == 'datetime') {
        let newValue = value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2} - [0-9]{4}-[0-9]{2}-[0-9]{2}$/) ? value : '1970-01-01 - 1970-01-01';
        return newValue.split(/\s+-\s+/);
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
}