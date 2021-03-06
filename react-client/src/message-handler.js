import io from "socket.io-client";
import { addParticipant, removeParticipant } from "./state/participants.js";

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
    return socket;
  }

  _socketSignalHandler(signal) {
    this.peer.signal(signal);
  }

  _socketMessageHandler(message) {
    console.log("Received message ", message);
  }

  _socketOpenHandler() {
    console.log("Connected to the signaling server");
    this.send("MESSAGE", "Hello world");
  }

  _socketCloseHandler() {
    console.log("Socket has been closed");
  }

  _socketErrorHandler(error) {
    console.error(error);
  }
}
