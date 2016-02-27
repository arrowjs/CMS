'use strict';

let _ = require('arrowjs')._;

class Toolbar {
    constructor() {
        this.toolbar = [];
        this.useDeleteModal = false;
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
    addGeneralButton(permission, properties) {
        permission = permission || true;

        // Check properties must be an object
        if (!_.isObject(properties)) {
            properties = {};
        }

        // Set properties default values
        let title = properties.title || ' ';
        let link = properties.link || 'javascript:void(0)';
        let target = properties.target ? `target="${properties.target}"` : '';
        let anchorClass = properties.anchorClass ? `class="${properties.anchorClass}"` : '';
        let anchorAttr = properties.anchorAttr || '';
        let buttonType = properties.buttonType || 'button';
        let buttonClass = properties.buttonClass ? `class="${properties.buttonClass}"` : `class="btn btn-default"`;
        let buttonAttr = properties.buttonAttr || '';

        // Display button if permission = true
        let button = '';
        if (permission)
            button = `<a href="${link}" ${target} ${anchorClass} ${anchorAttr}>
                        <button type="${buttonType}" ${buttonClass} ${buttonAttr}>
                            ${title}
                        </button>
                    </a>`;

        this.addButton(button);
    }

    /**
     * Add back button
     */
    addBackButton(req, key) {
        let link;
        if (req.session && req.session.search) {
            link = req.session.search[key] ? req.session.search[key] : 'javascript: window.history.back();';
        } else {
            link = 'javascript: window.history.back();'
        }

        this.addGeneralButton(true, {
            title: '<i class="fa fa-angle-left"></i> Back',
            link: link
        });
    }

    /**
     * Add create button
     */
    addCreateButton(permission, link) {
        this.addGeneralButton(permission, {
            title: '<i class="fa fa-plus"></i> Create new',
            link: link,
            buttonClass: 'btn btn-primary'
        });
    }

    /**
     * Add save button
     */
    addSaveButton(permission) {
        this.addGeneralButton(permission, {
            title: '<i class="fa fa-check"></i> Save',
            buttonType: 'submit',
            buttonClass: 'btn btn-success',
            buttonAttr: 'id="saveForm"'
        });
    }

    /**
     * Add delete button
     */
    addDeleteButton(permission) {
        this.useDeleteModal = true;
        this.addGeneralButton(permission, {
            title: '<i class="fa fa-remove"></i> Delete',
            anchorClass: 'pull-right',
            anchorAttr: 'data-toggle="modal" onclick="openDeleteConfirmModal()" id="deleteForm"',
            buttonClass: 'btn btn-danger'
        });
    }

    /**
     * Add search button
     */
    addSearchButton() {
        this.addGeneralButton(true, {
            title: '<i class="fa fa-search"></i> Search',
            buttonType: 'submit',
            buttonClass: 'btn btn-warning',
            buttonAttr: 'form="search-form" onclick="return document.forms[\'search-form\'].submit();"'
        });
    }

    /**
     * Add reset button
     */
    addRefreshButton(link) {
        this.addGeneralButton(true, {
            title: '<i class="fa fa-refresh"></i> Refresh',
            link: link,
            buttonClass: 'btn btn-info'
        });
    }

    /**
     * Render toolbar
     */
    render() {
        let toolbar = this.toolbar.join('');
        let content = `<div class="toolbar">${toolbar}</div>`;

        if (this.useDeleteModal)
            content += `<div class="modal fade" id="confirm-delete-modal" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                                        <h4 class="modal-title">Confirm Delete</h4>
                                    </div>
                                    <div class="modal-body">
                                        Are you sure you want to permanently delete these items ?
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn default" data-dismiss="modal">Cancel</button>
                                        <button type="button" class="btn btn-danger" onclick="deleteRecords()">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <script>
                            function openDeleteConfirmModal() {
                                var ids = [];
                                $("input:checkbox[name='ids[]']:checked").each(function () {
                                    ids.push($(this).val());
                                });

                                if (ids.length > 0 || $('#edit-form').length > 0) {
                                    $('#confirm-delete-modal').modal('show');
                                }
                            }
                        </script>`;

        return content;
    }

}

module.exports = {
    Toolbar: Toolbar
};