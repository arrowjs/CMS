'use strict';

let Promise = require('bluebird');
let WidgetForm = require(__base + 'library/js_utilities/WidgetForm');

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget_name) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget_name);

        // Create setting form
        let form = new WidgetForm();
        form.addText('title', 'Title');
        form.addRadio('gender','Gender', {'0':'Male', '1':'Female'}, '1');
        form.addSelect('layout', 'Layout', layouts);
        form.addCheckbox('level1', 'Level 1');
        form.addCheckbox('level2', 'Level 2');
        return form.render();
    };

    controller.updateWidget = function () {

    };

    controller.renderWidget = function (widget) {
        let renderWidget = Promise.promisify(component.render);

        //todo: get layout from db
        let layout = 'default';

        // Mockup render widget with default layout
        return renderWidget(layout, {
            widget: widget
        })
    };
};

