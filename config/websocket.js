"use strict";

/**
 * Websocket setting;
 * @type {{websocket_enable: boolean, websocket_cluster: boolean, websocket_folder: string}}
 */
module.exports = {
    websocket_enable: false,
    websocket_cluster: false, //only support web_socket
    websocket_folder: "/websockets/*.js"
};