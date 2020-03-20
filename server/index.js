import { Server } from 'ws';

// TODO: Read from configuration file
const configuration = {
  port: 3000,
  maxConnections: 255
}

const socketServer = new Server({
  port: configuration.port,
  perMessageDeflate: false
});

socketServer.on('connection', _onConnectionEstablished);
socketServer.on('error', _onConnectionError);

function _onConnectionEstablished(socket) {
  Logger.info('Client has connected.');

  if (this.#sockets.length < configuration.maxConnections) {
    socket.on('move', (message) => {
      // TODO: Handle person move
    });

    socket.on('error', _closeConnection(socket));
    socket.on('close', _closeConnection(socket));

    this.#sockets.push(socket);
  } else {
    Logger.info('Server is full');

    socket.close();
  }
}

function _onConnectionError(error) {
  Logger.error(`Unhandled error code: ${error}.`);

  process.exit(1);
}

function _closeConnection(socket) {
  // TODO: Handle player leave
}