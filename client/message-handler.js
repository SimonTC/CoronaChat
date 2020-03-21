import io from "socket.io-client";
import { addParticipant, removeParticipant } from "./index";

const SOCKET_SERVER = {
  PORT: 3000,
  PATH: "/chat"
};
export default class MessageHandler {
  constructor(peer) {
    this.peer = peer;
    this.socket = this._initializeSocket();
  }

  send(type, payload) {
    this.socket.emit(type, payload);
  }

  get SOCKET_SERVER() {
    return window.location.protocol + "//" + window.location.hostname + ":" + SOCKET_SERVER.PORT;
  }

  _initializeSocket() {
    // const socket = new WebSocket(`ws://localhost:3000`);
    const socket = io(this.SOCKET_SERVER, {
      path: SOCKET_SERVER.PATH
    });

    socket.addEventListener("MESSAGE", this._socketMessageHandler.bind(this));
    socket.addEventListener("CONNECTED", this._socketOpenHandler.bind(this));
    socket.addEventListener("DISCONNECTED", this._socketCloseHandler.bind(this));
    socket.addEventListener("ERROR", this._socketErrorHandler.bind(this));
    socket.addEventListener("USER_JOIN", this._socketUserJoinedHandler.bind(this));

    return socket;
  }

  _socketMessageHandler(message) {
    try {
      const payload = JSON.parse(message.data);

      switch (payload.type) {
        case "rtc-signal":
          this.peer.signal(payload.data);
          break;
        default:
          console.log("Other message received ", message.data);
      }
    } catch (error) {
      console.error(`Failed to parse incoming message ${message}`);
    }
  }

  _socketOpenHandler(d) {
    console.log("Connected to the signaling server", "-", d);
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

  _socketErrorHandler(error) {
    console.error(error);
  }
}
