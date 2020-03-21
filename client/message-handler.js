import io from "socket.io-client";
import { addParticipant, removeParticipant } from "./index";

const SOCKET_SERVER = {
  PORT: 3000,
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
    return `${window.location.protocol}//${window.location.hostname}:${SOCKET_SERVER.PORT}`;
  }

  _initializeSocket() {
    const socket = io(this.SOCKET_SERVER, {
      path: SOCKET_SERVER.PATH
    });

    socket.addEventListener("DISCONNECTED", this._socketCloseHandler.bind(this));
    socket.addEventListener("ERROR", this._socketErrorHandler.bind(this));
<<<<<<< Updated upstream

=======
    socket.addEventListener("RTC-SIGNAL", this._socketSignalHandler.bind(this));
    socket.addEventListener("USER_ADD", addParticipant);
>>>>>>> Stashed changes
    return socket;
  }

  _socketSignalHandler(signal) {
    this.peer.signal(signal);
  }

<<<<<<< Updated upstream
  _socketCloseHandler(socketId) {
    console.log(`Client '${socketId}' has been disconnected.`);
=======
  _socketMessageHandler(message) {
    console.log("Received message ", message);
  }

  _socketOpenHandler() {
    console.log("Connected to the signaling server");
    this.send("MESSAGE", "Hello world");
  }

  _socketCloseHandler() {
    console.log("Socket has been closed");
>>>>>>> Stashed changes
  }

  _socketErrorHandler(error) {
    console.error(error);
  }
}
