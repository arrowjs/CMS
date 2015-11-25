'use strict';

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

        return new Promise(function (fullfill, reject) {
            fullfill(form.render());
        })
    };

    controller.renderWidget = function (widget) {
        // Get layouts
        let layout;
        try {
            layout = JSON.parse(widget.data).layout;
        } catch (err) {
            layout = component.getLayouts(widget.widget_name)[0];
        }

        // Get all posts user choose
        let ids = JSON.parse(widget.data).id_posts.split(",");
        let atts = ['id', 'title', 'alias', 'image', 'intro_text'];
        if (JSON.parse(widget.data).display_date == 1) atts.push('published_at');

        if (ids.length > 0) {
            return application.models.post.findAll({
                attributes: atts,
                order: 'published_at DESC',
                where: {
                    id: {
                        $in: ids
                    },
                    published: 1,
                    type: 'post'
                },
                raw: true
            }).then(function (posts) {
                // Render view with layout
                return component.render(layout, {
                    widget: JSON.parse(widget.data),
                    posts: posts
                })
            });
        }
    };
};

