'use strict';

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        return application.models.menu.findAll({raw: true}).then(function (menus) {
            let options = {};

            for (let i in menus) {
                options[menus[i].id] = menus[i].name;
            }

            // Get all widget layouts
            let layouts = component.getLayouts(widget.widget_name);

            // Create setting form
            let form = new ArrowHelper.WidgetForm(widget);
            form.addSelect('layout', 'Layout file', layouts);
            form.addSelect('menu_id', 'Menus', options);
            form.addCheckbox('search', 'Display search');
            return form.render();
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

        // Get all categories
        return application.models.menu.findById(JSON.parse(widget.data).menu_id)
            .then(function (menu) {
                return application.models.menu_detail.findAll({
                    where: {
                        menu_id: JSON.parse(widget.data).menu_id
                    },
                    raw: true
                }).then(function (menuItems) {
                    let menu_order = JSON.parse(menu.menu_order);
                    // Render view with layout
                    return component.render(layout, {
                        widget: JSON.parse(widget.data),
                        menuOrder: menu_order,
                        menuItems: menuItems
                    })
                })
            }).catch(function (err) {
                return '';
            });
    };
};

