'use strict';

let Promise = require('bluebird');

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget.widget_name);

        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addText('title', 'Title');
        form.addText('number_of_post_archives', 'Number of Post Archives');
        form.addSelect('layout', 'Layout', layouts);
        return form.render();
    };

    controller.renderWidget = function (widget) {
        // Get layouts
        let layout;
        try{
            layout=JSON.parse(widget.data).layout;
        }catch(err){
            layout=component.getLayouts(widget.widget_name)[0];
        }

        // Get all categories
        return application.models.post.findAll({
            raw: true,
            limit: JSON.parse(widget.data).number_of_categories
        }).then(function(categories){
            // Render view with layout
            return component.render(layout, {
                widget: widget.data,
                categories: categories
            })
        });
    };
};

