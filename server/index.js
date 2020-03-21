const ws = require("ws");
const config = require("../config/index.json");

const socketServer = new ws.Server({
  port: config.socketServerPort,
  perMessageDeflate: false
});

const connectedSockets = [];

socketServer.on("connection", _onConnectionEstablished);
socketServer.on("error", _onConnectionError);

function _onConnectionEstablished(socket) {
  console.info("Client has connected.");

  if (connectedSockets.length >= config.maxConnections) {
    console.info("Server is full");

    socket.close();
    return;
  }

  socket.on("move", _onMove);

  socket.on("message", message => _onMessage(message, socket));

  socket.on("error", _closeConnection);
  socket.on("close", _closeConnection);

  connectedSockets.push(socket);
}

function _onMessage(message, sender) {
  connectedSockets.forEach(function each(client) {
    if (client !== sender && client.readyState === ws.OPEN) {
      client.send(message);
    }
  });
}

function _onMove(message) {
  console.info("Somebody is moving");
}

function _onConnectionError(error) {
  console.error(`Unhandled error code: ${error}.`);

  process.exit(1);
}

function _closeConnection(socket) {
  console.info("Connection closing");
  // TODO: Handle player leave
}
