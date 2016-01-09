'use strict';

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addSelect('layout_type', 'Layout type', {
            box_count: 'Box count',
            button_count: 'Button count',
            button: 'Button',
            icon_link: 'Icon link',
            icon: 'Icon',
            link: 'Link'
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

