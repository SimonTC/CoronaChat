import io from "socket.io-client";

export default class MessageHandler {
  constructor(peer) {
    this.peer = peer;
    this.socket = this._initializeSocket();
  }

  send(payload) {
    this.socket.send(JSON.stringify(payload));
  }

  _initializeSocket() {
    // const socket = new WebSocket(`ws://localhost:3000`);
    const socket = io("http://localhost:3000", {
      // port: 3000,
      path: "/chat"
    });

    // socket.addEventListener('message', this._socketMessageHandler.bind(this));
    // socket.addEventListener('open', this._socketOpenHandler.bind(this));
    // socket.addEventListener('close', this._socketCloseHandler.bind(this));
    // socket.addEventListener('error', this._socketErrorHandler.bind(this));

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
  }

  _socketCloseHandler() {
    console.log("Socket has been closed");
  }

  _socketErrorHandler(error) {
    console.error(error);
  }
}