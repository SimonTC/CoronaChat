import io from "socket.io-client";

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
