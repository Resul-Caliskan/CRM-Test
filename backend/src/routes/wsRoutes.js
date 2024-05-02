// websocket_routes.js

const websocketController = require('../controllers/wsDemandController');

function initWebSocketRoutes(server) {
    websocketController.initWebSocket(server);
}

module.exports = { initWebSocketRoutes };
