'use strict';

let slug = require('slug');

module.exports = function (action, comp, app) {
    /**
     * Find post by ID
     * @param id {integer} - Id of post
     */
    action.findById = function (id) {
        return app.models.post.findById(id);
    };

    /**
     * Find post with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.find = function (conditions) {
        return app.models.post.find(conditions);
    };

    /**
     * Find all posts with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.findAll = function (conditions) {
        return app.models.post.findAll(conditions);
    };

    /**
     * Find and count all posts with conditions
     * @param conditions {object} - Conditions used in query
     */
    action.findAndCountAll = function (conditions) {
        return app.models.post.findAndCountAll(conditions);
    };

    /**
     * Count posts
     */
    action.count = function () {
        return app.models.post.count()
    };

    /**
     * Create new post
     * @param data {object} - Data of new post
     * @param type {string} - Type of post
     */
    action.create = function (data, type) {
        data = optimizeData(data);
        data.type = type;

        // If post was published
        if (+data.published) {
            if (!data.title) data.title = '(no title)';
            data.published_at = Date.now();

            // Set intro_text equal to full_text if intro_text is empty
            if (data.full_text && !data.intro_text)
                data.intro_text = data.full_text
        }

        return app.models.post.create(data);
    };

    /**
     * Update post
     * @param post {object} - Post need to update
     * @param data {object} - New data
     */
    action.update = function (post, data) {
        data = optimizeData(data);

        // If post was published
        if (+data.published) {
            if (!data.title) data.title = '(no title)';
            if (data.published != post.published) data.published_at = Date.now();

            // Set intro_text equal to full_text if intro_text is empty
            if (data.full_text && !data.intro_text)
                data.intro_text = data.full_text
        }

        return post.updateAttributes(data);
    };

    /**
     * Delete posts by ids
     * @param ids {array} - Array ids of posts
     */
    action.destroy = function (ids) {
        return app.models.post.destroy({
            where: {
                id: {
                    $in: ids
                }
            }
        })
    };

    function optimizeData(data) {
        if (data.title) {
            // Trim title, slug alias
            data.title = data.title.trim();
            data.alias = data.alias || slug(data.title.toLowerCase());
        }

        // Set default values
        data.alias = data.alias || Date.now().toString();
        data.author_visible = (data.author_visible != null);
        data.categories = data.categories || '';
        data.published = data.published || 0;

        return data;
    }
};