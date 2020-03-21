import io from "socket.io-client";
import { addParticipant, removeParticipant, updateCurrentParticipant } from "./index";

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
    console.log("type", type);
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
    socket.addEventListener("RTC-SIGNAL", this._socketSignalHandler.bind(this));
    socket.addEventListener("USER_ADD", addParticipant);
    socket.addEventListener("MOVE", this._socketMoveHandler(this));

    return socket;
  }

  _socketSignalHandler(signal) {
    this.peer.signal(signal);
  }

  _socketCloseHandler(socketId) {
    console.log(`Client '${socketId}' has been disconnected.`);
  }

  _socketMessageHandler(message) {
    console.log("Received message ", message);
  }

  _socketOpenHandler(socketId) {
    console.log("Connected to the signaling server", "-", socketId);
    updateCurrentParticipant(socketId);
    this.send("MESSAGE", "Hello world");
    this.send("USER_JOIN", "my name");
  }
  _socketUserJoinedHandler(socketId) {
    console.log("new user join", socketId);
    addParticipant(socketId);
  }

  _socketCloseHandler(socketId) {
    console.log("Socket has been closed", socketId);
    removeParticipant(socketId);
  }

  _socketMoveHandler(user) {
    console.log("moving", user);
  }

  _socketErrorHandler(error) {
    console.error(error);
  }
  sendNewMousePosition() {
    console.log("moving");
  }
}
