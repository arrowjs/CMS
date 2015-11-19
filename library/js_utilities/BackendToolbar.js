'use strict';

let log = require('arrowjs').logger;

class BackendToolbar {
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
    addGeneralButton(permission, title, link, icon, cssClass, onclickFunction, target) {
        permission = permission || false;
        icon = icon || '';
        link = link || 'javascript: void(0);';
        cssClass = cssClass || 'btn btn-default';
        onclickFunction = (onclickFunction) ? ` onclick="${onclickFunction}"` : ``;
        target = (target) ? ` target="${target}"` : ``;

        let button = '';

        // Display button if permission = true
        if (permission)
            button = `<a href="${link}"${target}>
                        <button class="${cssClass}"${onclickFunction}>${icon} ${title}</button>
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
        this.addGeneralButton(permission, 'Create new', link, '<i class="fa fa-plus"></i>', 'btn btn-primary');
    }

    /**
     * Add save button
     */
    addSaveButton(permission) {
        let button = '';

        if (permission)
            button = `<button type="submit" id="saveForm" class="btn btn-success">
                        <i class="fa fa-check"></i> Save
                    </button>`;
        this.addButton(button);
    }

    /**
     * Add delete button
     */
    addDeleteButton(permission) {
        let button = '';

        if (permission)
            button = `<a class="btn btn-danger pull-right" data-toggle="modal" href="javascript: void(0);"
                       onclick="openDeleteConfirmModal()">
                        <i class="fa fa-remove"></i> Delete
                    </a>`;
        this.addButton(button);
    }

    /**
     * Add search button
     */
    addSearchButton(permission) {
        let button = '';

        if (permission)
            button = `<button type="submit" form="search-form" class="btn btn-warning"
                       onclick='return document.forms["search-form"].submit();'>
                        <i class="fa fa-search"></i> Search
                    </button>`;
        this.addButton(button);
    }

    /**
     * Add reset button
     */
    addRefreshButton(link) {
        this.addGeneralButton(true, 'Refresh', link, '<i class="fa fa-refresh"></i>', 'btn btn-info');
    }

    /**
     * Render toolbar
     */
    render() {
        return this.toolbar.join('');
    }

}

module.exports = BackendToolbar;