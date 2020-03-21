const Peer = require("simple-peer");

export default class CoronaPeer {
  constructor(socket, initiator, mediaStream) {
    this.socket = socket;
    this.initiator = initiator;
    this.mediaStream = mediaStream;
    this.peer = this._getPeer(mediaStream);
  }

  _getPeer() {
    const peer = new Peer({
      initiator: this.initiator,
      stream: this.mediaStream
    });

    // Called when a message is received from the server.
    this.socket.onmessage = message => this._onMessageFromServer.call(this, message, peer);

    this.socket.onopen = () => {
      console.log("Connected to the signaling server");
    };

    this.socket.onerror = err => {
      console.error(err);
    };

    peer.on("signal", this._sendSignalToPeer.bind(this));
    peer.on("error", this._onPeerError.bind(this));
    peer.on("connect", this._onPeerConnectionOpen.bind(this));
    peer.on("data", this._onDataReceivedFromPeer.bind(this));
    peer.on("stream", this._onStreamOpenedFromPeer.bind(this));

    return peer;
  }

  _sendSignalToPeer(data) {
    const message = {
      type: "rtc-signal",
      data
    };

    this.socket.send(JSON.stringify(message));
  }

  _onMessageFromServer(message) {
    const payload = JSON.parse(message.data);

    switch (payload.type) {
      case "rtc-signal":
        this.peer.signal(payload.data);
        break;
      default:
        console.log("Other message received ", message.data);
    }
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
