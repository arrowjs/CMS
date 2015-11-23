'use strict';

let Promise = require('bluebird');

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget.widget_name);

        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addText('title', 'Title');
        form.addText('id_posts', 'Ip posts (Eg: 1, 5, 2)');
        form.addCheckbox('display_date', 'Display date');
        form.addSelect('layout', 'Layout', layouts);
        return form.render();
    };

    controller.renderWidget = function (widget) {
        // Get layouts
        let layout = widget.data.layout || component.getLayouts(widget.widget_name)[0];

        // Get all posts user choose
        let ids = JSON.parse(widget.data).id_posts.split(",");

        return application.models.post.findAll({
            where: {
                id :{
                    $in : ids
                }
            },
            raw: true
        }).then(function(posts){
            // Render view with layout
            return component.render(layout, {
                widget: JSON.parse(widget.data),
                posts: posts
            })
        });
    };
};

