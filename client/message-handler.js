import io from "socket.io-client";

const port = process.env.PORT || 3000;

console.log("Accessing server on port ", port)

const SOCKET_SERVER = {
  PORT: port,
  PATH: "/chat"
};

export default class MessageHandler {
  constructor() {
    this._handlers = [];
    this.socket = this._initializeSocket();
  }

  on(eventType, handler) {
    this.socket.addEventListener(eventType, handler);
  }

  send(type, payload) {
    this.socket.emit(type, payload);
  }

  get SOCKET_SERVER() {
    return `${window.location.protocol}//${window.location.hostname}`;
    // return `${window.location.protocol}//${window.location.hostname}:${SOCKET_SERVER.PORT}`;
  }

  _initializeSocket() {
    const socket = io(this.SOCKET_SERVER, {
      path: SOCKET_SERVER.PATH
    });

    socket.addEventListener("DISCONNECTED", this._socketCloseHandler.bind(this));
    socket.addEventListener("ERROR", this._socketErrorHandler.bind(this));

    return socket;
  }

  _socketSignalHandler(signal) {
    this.peer.signal(signal);
  }

  _socketCloseHandler(socketId) {
    console.log(`Client '${socketId}' has been disconnected.`);
  }

  _socketErrorHandler(error) {
    console.error(error);
  }
}
