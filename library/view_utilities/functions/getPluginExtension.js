"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;
let Promise = require('arrowjs').Promise;

module.exports = {
    async: true,
    handler: function (key, callback) {
        let app = this;
        if (key) {
            app.models.plugin.findAll({
                where: {
                    active: true
                },
                order: "ordering asc",
                raw: true
            }).then(function (plugins) {
                if (_.isEmpty(plugins)) {
                    callback(null, "")
                } else {
                    let nav = "";
                    let body = "";
                    let jsscript = "" ;

                    Promise.map(plugins, function (plugin) {
                        let pluginName = plugin.plugin_name;
                        if (app.plugin[pluginName]) {
                            if (plugin.data) {
                                _.assign(app.plugin[pluginName], JSON.parse(plugin.data));
                            }
                            if (app.plugin[pluginName].actions.getData) {
                                return app.plugin[pluginName].actions.getData(key).then(function (result) {
                                    if (result) {
                                        if (app.plugin[pluginName].dataType === "json") {
                                            result.value = JSON.parse(result.value)
                                        }
                                    } else {
                                        result = {};
                                        result.value = {};
                                    }

                                    let data = {};
                                    data[pluginName] = result.value;
                                    data.pluginName = pluginName;

                                    return app.plugin[pluginName].render("extension", data).then(function (info) {
                                        nav += `<li class=""><a href="#${pluginName}" data-toggle="tab" aria-expanded="false">${app.plugin[pluginName].title}</a></li>`;
                                        body += `<div id="${pluginName}">${info}</div>`;
                                        if(app.plugin[pluginName].onSave) {
                                            jsscript += `
                                                var ${pluginName}Element = document.getElementById("${pluginName}_form");
                                                var ${pluginName}Data = new FormData(${pluginName}Element);
                                                ${pluginName}Data.append('key', "${key}");
                                                var ${pluginName}xhr = new XMLHttpRequest();
                                                ${pluginName}xhr.open('POST', '${app.plugin[pluginName].onSave}');
                                                ${pluginName}xhr.send(${pluginName}Data);
                                            `
                                        }
                                        return null
                                    })
                                })
                            }
                        }
                    }).then(function () {
                        var raw = `<section class="col-md-12 ui-sortable">
                                    <!-- Custom tabs (Charts with tabs)-->
                                    <div class="nav-tabs-custom" style="cursor: move;">

                                            <ul class="nav nav-tabs pull-right ui-sortable-handle">
                                                ${nav}
                                                <li class="pull-left header"><i class="fa fa-inbox"></i> Plugin Extensions</li>
                                            </ul>
                                        <div class="tab-content no-padding">
                                                ${body}
                                        </div>
                                    </div>
                                </section>
                                <script>
                                    document.getElementById("saveForm").onclick = function(){
                                        ${jsscript}
                                    }
                                </script>`;
                        callback(null, raw)
                    })


                }
            }).catch(function (err) {
                callback(null, "")
            })
        } else {
            callback(null, "")
        }
    }
};