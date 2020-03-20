const ws = require('ws');

// TODO: Read from configuration file
const configuration = {
  port: 3000,
  maxConnections: 255
}

const socketServer = new ws.Server({
  port: configuration.port,
  perMessageDeflate: false
});

const connectedSockets = [];

socketServer.on('connection', _onConnectionEstablished);
socketServer.on('error', _onConnectionError);

function _onConnectionEstablished(socket) {
  console.info('Client has connected.');

  if (connectedSockets.length < configuration.maxConnections) {
    socket.on('move', (message) => {
      // TODO: Handle person move
    });

    socket.on('error', _closeConnection(socket));
    socket.on('close', _closeConnection(socket));

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