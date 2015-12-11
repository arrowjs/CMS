"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;
let Promise = require('arrowjs').Promise;

module.exports = {
    async: true,
    handler: function (id,type,callback) {
        let app = this;
        if(id && type) {
            app.models.plugin.findAll({
                where : {
                    active : true
                },
                order : "ordering asc",
                raw : true
            }).then(function (plugins) {
                if(_.isEmpty(plugins)) {
                    callback(null,"")
                } else {
                    let nav = "";
                    let body = "";

                    Promise.map(plugins,function (plugin) {
                        let pluginName = plugin.plugin_name;
                        if (app.plugin[pluginName]) {
                            if (plugin.data) {
                                _.assign(app.plugin[pluginName],JSON.parse(plugin.data));
                            }
                            return app.plugin[pluginName].render("extension").then(function (info) {
                                nav += `<li class=""><a href="#${pluginName}" data-toggle="tab" aria-expanded="false">${app.plugin[pluginName].title}</a></li>`;
                                body += `<div id="${pluginName}">${info}</div>`
                                return null
                            })
                        }
                    }).then(function () {
                        var raw = `<section class="col-md-12 ui-sortable">
                                    <!-- Custom tabs (Charts with tabs)-->
                                    <div class="nav-tabs-custom" style="cursor: move;">
                                        <!-- Tabs within a box -->
                                            <ul class="nav nav-tabs pull-right ui-sortable-handle">
                                                ${nav}
                                                <li class="pull-left header"><i class="fa fa-inbox"></i> Plugin Extensions</li>
                                            </ul>
                                        <div class="tab-content no-padding">
                                                ${body}
                                        </div>
                                    </div>
                                </section>`
                        callback(null,raw)
                    })


                }
            }).catch(function (err) {
                callback(null,"")
            })
        } else {
            callback(null,"")
        }
    }
};