'use strict';

let Promise = require('bluebird');
let WidgetForm = require(__base + 'library/js_utilities/WidgetForm');

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget.widget_name);

        // Create setting form
        let form = new WidgetForm(widget);
        form.addText('title', 'Title');
        form.addText('show_post_count', 'Show post count');
        form.addSelect('layout', 'Layout', layouts);
        return form.render();
    };

    controller.renderWidget = function (widget) {
        // Get layouts
        let layout = widget.data.layout || component.getLayouts(widget.widget_name)[0];

        // Render view with layout
        let renderWidget = Promise.promisify(component.render);
        return renderWidget(layout, {
            widget: widget.data
        })
    };
};

