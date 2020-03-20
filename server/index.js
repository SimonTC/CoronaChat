const ws = require("ws");
const config = require("../config/index.json");

const socketServer = new ws.Server({
  port: config.socketServerPort,
  perMessageDeflate: false
});

const connectedSockets = [];

socketServer.on('connection', _onConnectionEstablished);
socketServer.on('error', _onConnectionError);

function _onConnectionEstablished(socket) {
  console.info('Client has connected.');

  if (connectedSockets.length < config.maxConnections) {
    socket.on('move', (message) => {
      // TODO: Handle person move
    });

    socket.on('error', _closeConnection);
    socket.on('close', _closeConnection);

    connectedSockets.push(socket);
  } else {
    console.info('Server is full');

    socket.close();
  }
}

function _onConnectionError(error) {
  console.error(`Unhandled error code: ${error}.`);

  process.exit(1);
}

function _closeConnection(socket) {
  // TODO: Handle player leave
}