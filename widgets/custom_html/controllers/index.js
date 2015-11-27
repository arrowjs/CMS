'use strict';

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget.widget_name);

        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addText('title', 'Title');
        form.addText('css_class', 'CSS Class');
        form.addTextArea('content', 'Content');
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
        // Render view with layout
        return component.render(layout, {
            widget: JSON.parse(widget.data)
        })
    };
};

