'use strict';

let Promise = require('bluebird');

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget.widget_name);

        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addText('title', 'Title');
        form.addTextArea('content', 'Content');
        form.addSelect('layout', 'Layout', layouts);
        return form.render();
    };

    controller.renderWidget = function (widget) {
        // Get layouts
        let layout = widget.data.layout || component.getLayouts(widget.widget_name)[0];

        // Render view with layout
        return component.render(layout, {
            widget: widget.data
        })
    };
};

