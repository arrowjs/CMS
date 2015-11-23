'use strict';

let Promise = require('bluebird');

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget.widget_name);

        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addText('title', 'Title');
        form.addText('number_of_recent_posts', 'Number of Recent Posts');
        form.addSelect('layout', 'Layout', layouts);
        return form.render();
    };

    controller.renderWidget = function (widget) {
        // Get layouts
        let layout = widget.data.layout || component.getLayouts(widget.widget_name)[0];

        // Get all categories
        return application.models.post.findAll({
            raw: true,
            order: 'published_at desc',
            limit: JSON.parse(widget.data).number_of_recent_posts
        }).then(function(posts){
            // Render view with layout
            return component.render(layout, {
                widget: JSON.parse(widget.data),
                posts: posts
            })
        });
    };
};

