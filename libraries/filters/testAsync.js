"use strict";

module.exports = {
    async: true,
    handler: function (string, callback) {
        this.models.post.findById(1).then(function (post) {
            callback(null, post);
        });
    }
};