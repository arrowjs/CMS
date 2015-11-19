'use strict';

let log = require('arrowjs').logger;

class Toolbar {
    constructor() {
        this.toolbar = [];
    }

    /**
     * Add an button
     */
    addButton(button) {
        this.toolbar.push(button);
    }

    /**
     * Add general button
     */
    addGeneralButton(permission, title, link, icon, wrapperClass, buttonClass, onclickFunction, target) {
        permission = permission || false;
        icon = icon || '';
        link = link || 'javascript: void(0);';
        wrapperClass = wrapperClass || '';
        buttonClass = buttonClass || 'btn btn-default';
        onclickFunction = (onclickFunction) ? ` onclick="${onclickFunction}"` : ``;
        target = (target) ? ` target="${target}"` : ``;

        let button = '';

        // Display button if permission = true
        if (permission)
            button = `<a href="${link}"${target} class=${wrapperClass}>
                        <button type="button" class="${buttonClass}"${onclickFunction}>
                            ${icon} ${title}
                        </button>
                    </a>`;

        this.addButton(button);
    }

    /**
     * Add back button
     */
    addBackButton(link) {
        link = link || 'javascript: window.history.back();';
        this.addGeneralButton(true, 'Back', link, '<i class="fa fa-angle-left"></i>');
    }

    /**
     * Add create button
     */
    addCreateButton(permission, link) {
        this.addGeneralButton(permission, 'Create new', link, '<i class="fa fa-plus"></i>', '', 'btn btn-primary');
    }

    /**
     * Add save button
     */
    addSaveButton(permission) {
        let button = '';

        if (permission)
            button = `<a href="javascript: void(0);">
                        <button type="submit" id="saveForm" class="btn btn-success">
                            <i class="fa fa-check"></i> Save
                        </button>
                    </a>`;
        this.addButton(button);
    }

    /**
     * Add delete button
     */
    addDeleteButton(permission) {
        let button = '';

        if (permission)
            button = `<a class="pull-right" data-toggle="modal" onclick="openDeleteConfirmModal()">
                        <button class="btn btn-danger">
                            <i class="fa fa-remove"></i> Delete
                        </button>
                    </a>`;
        this.addButton(button);
    }

    /**
     * Add search button
     */
    addSearchButton(permission) {
        let button = '';

        if (permission)
            button = `<a href="javascript: void(0);">
                        <button type="submit" form="search-form" class="btn btn-warning"
                           onclick='return document.forms["search-form"].submit();'>
                            <i class="fa fa-search"></i> Search
                        </button>
                    </a>`;
        this.addButton(button);
    }

    /**
     * Add reset button
     */
    addRefreshButton(link) {
        this.addGeneralButton(true, 'Refresh', link, '<i class="fa fa-refresh"></i>', '', 'btn btn-info');
    }

    /**
     * Render toolbar
     */
    render() {
        let toolbar = this.toolbar.join('');
        return `<div class="toolbar">${toolbar}</div>`;
    }

}

module.exports = {
    Toolbar: Toolbar
};