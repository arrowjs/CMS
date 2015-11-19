'use strict';

let Promise = require('bluebird');

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget.widget_name);

        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addText('title', 'Title');
        form.addText('show_post_count', 'Show post count');
        form.addSelect('layout', 'Layout', layouts);
        return form.render();
    };

    controller.renderWidget = function (widget) {
        // Get layouts
        let layout = widget.data.layout || component.getLayouts(widget.widget_name)[0];

        // Get all categories
        return application.models.category.findAll({
            raw: true,
            limit: 10
        }).then(function(categories){
            // Render view with layout
            return component.render(layout, {
                widget: widget.data,
                categories: categories
            })
        });
    };
};

