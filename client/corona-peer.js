import MessageHandler from "./message-handler";

const Peer = require("simple-peer");

export default class CoronaPeer {
  constructor(initiator, mediaStream) {
    this.initiator = initiator;
    this.mediaStream = mediaStream;
    this.peer = this._getPeer(mediaStream);
    this.messageHandler = this._getMessageHandler();
  }

  _getMessageHandler() {
    const messageHandler = new MessageHandler();

    messageHandler.on("RTC-SIGNAL", signal => {
      console.log("Received RTC-Signal: ", signal);
      this.peer.signal(signal);
    });

    messageHandler.on("CONNECTED", () => {
      messageHandler.send("MESSAGE", "Hello world");
    });

    messageHandler.on("MESSAGE", message => {
      console.log("Received message ", message);
    });

    messageHandler.send("USER_JOIN", `User${~~(Math.random() * 1000)}`);

    return messageHandler;
  }

  _getPeer() {
    const peer = new Peer({
      initiator: this.initiator,
      stream: this.mediaStream
    });

    // Called when a message is received from the server.
    peer.on("signal", this._sendSignalToPeer.bind(this));
    peer.on("error", this._onPeerError.bind(this));
    peer.on("connect", this._onPeerConnectionOpen.bind(this));
    peer.on("data", this._onDataReceivedFromPeer.bind(this));
    peer.on("stream", this._onStreamOpenedFromPeer.bind(this));

    return peer;
  }

  _sendSignalToPeer(data) {
    this.messageHandler.send("RTC-SIGNAL", data);
  }

  _onPeerConnectionOpen() {
    console.log("CONNECT");
    this.peer.send("whatever" + Math.random());
  }

  _onDataReceivedFromPeer(data) {
    console.log("data: " + data);
  }

  _onStreamOpenedFromPeer(stream) {
    const audio = document.querySelector("audio");

    if ("srcObject" in audio) {
      audio.srcObject = stream;
    } else {
      audio.src = window.URL.createObjectURL(stream); // for older browsers
    }

    audio.play();
  }

  _onPeerError(error) {
    console.log("error", error);
  }
}
