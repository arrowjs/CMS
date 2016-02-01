'use strict';

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addText('title', 'Title');
        form.addText('number_of_posts', 'Number of posts');
        form.addSelect('color_scheme', 'Color scheme', {
            light: 'Light',
            dark: 'Dark'
        });
        form.addSelect('order_by', 'Order By', {
            social: 'Social',
            reverse_time: 'Reverse time',
            time: 'Time'
        });

        return new Promise(function (fullfill, reject) {
            fullfill(form.render());
        })
    };

    controller.renderWidget = function (widget) {
        let layout = component.getLayouts(widget.widget_name)[0];

        // Render view with layout
        return component.render(layout, {
            widget: JSON.parse(widget.data)
        });
    };
};

