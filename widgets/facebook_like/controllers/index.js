'use strict';

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addSelect('layout_type', 'Layout type', {
            standard: 'Standard',
            box_count: 'Box count',
            button_count: 'Button count',
            button: 'Button'
        });
        form.addSelect('action_type', 'Action type', {
            like: 'Like',
            recommend: 'Recommend'
        });
        form.addSelect('color_scheme', 'Color scheme', {
            light: 'Light',
            dark: 'Dark'
        });
        form.addCheckbox('show_friend_faces', 'Show friend faces');
        form.addCheckbox('include_share_button', 'Include share button');

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

