"use strict";

/** Style flash messages */
module.exports = {
    handler : function (messages) {
        let html = '';

        if (messages && messages.length > 0) {
            html += '<div class="col-md-12 col-sm-12 col-xs-12" style="padding: 15px">';

            for (let i in messages) {
                let mgs_class = '';
                let mgs_icon = '';
                let message = messages[i];

                if (message.type == 'error') {
                    mgs_class = 'alert-danger';
                    mgs_icon = 'icon fa fa-ban';
                }

                if (message.type == 'success') {
                    mgs_class = 'alert-success';
                    mgs_icon = 'icon fa fa-check';
                }

                if (message.type == 'warning') {
                    mgs_class = 'alert-warning';
                    mgs_icon = 'icon fa fa-warning';
                }

                if (message.type == 'info') {
                    mgs_class = 'alert-notice';
                    mgs_icon = 'icon fa fa-info';
                }

                html += '<div class="alert alert-dismissable ' + mgs_class + '" style="margin-bottom:0px;">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" style="margin-top: 15px"><i class="fa-lg fa fa-close"></i></button>' +
                    '<h4><i class="' + mgs_icon + '"></i> ' + message.type.toUpperCase() + '</h4>' +
                    '<p>' + message.content +
                    '</div>';
            }
            html += '</div>';
        }

        return html;
    }
}
