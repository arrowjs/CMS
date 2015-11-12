'use strict';

module.exports = function (controller, component, application) {
    controller.index = function (req, res) {
        res.send('Backend');
    };
};