'use strict';

class Categories {
    constructor() {
        console.log('categories widget');
    }

    getLayouts() {
        // Get all layout files of widgets
    }

    createForm(widget_type, widget) {
        // Create setting form
    }

    saveForm() {
        // Save user settings
    }

    renderView() {
        // Render frontend view
    }
}

//module.exports = Categories;

module.exports = function (controller, component, application) {

    controller.createWidget = function () {
        return "<h1>New widget:</h1>" +
            "<label>Title</label>" +
            "<input type='text'/>";
    };

    controller.saveWidget = function () {
        console.log("\x1b[33m", 'Save widget to database', "\x1b[0m");
        return "<h1><em>success</em></h1>";
    };

    controller.renderWidget = function () {
        return "<h3>Category list</h3>" +
            "<ul>" +
            "<li>Books</li>" +
            "<li>Jobs</li>" +
            "</ul>";
    };
};

