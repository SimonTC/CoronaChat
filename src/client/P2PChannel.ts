import SocketHandler from "./SocketHandler";
import P2PMediaStream from "./P2PMediaStream";

const ICE_SERVERS: RTCIceServer[] = [{
  urls: [ "stun:stun.l.google.com:19302" ]
}];

export default class P2PChannel {
  #defaultChannel = "corona";
  #socketHandler: SocketHandler;

  #localMediaStream: P2PMediaStream;

  #peers: {
    [socketId: string]: RTCPeerConnection
  } = {};
  #peerMediaStreams: {
    [socketId: string]: P2PMediaStream
  } = {};

  constructor(socketHandler: SocketHandler) {
    this.#localMediaStream = new P2PMediaStream({
      audio: true,
      video: true
    });

    this.#socketHandler = socketHandler;

    this.#socketHandler.on("connected", () => this.handleSocketConnected());
    this.#socketHandler.on("disconnected", () => this.handleSocketDisconnected());
    this.#socketHandler.on("addPeer", message => this.handleAddPeer(message));
    this.#socketHandler.on("removePeer", message => this.handleRemovePeer(message));
    this.#socketHandler.on("sessionDescription", message => this.handleSessionDescription(message));
    this.#socketHandler.on("iceCandidate", message => this.handleICECandidate(message));
  }

  private handleSocketConnected() {
    this.#localMediaStream
      .setup()
      .then(() => this.joinChannel(this.#defaultChannel));
  }

  private handleSocketDisconnected() {
    for (const peerId in this.#peerMediaStreams) {
      this.#peerMediaStreams[peerId].remove();
    }

    for (const peerId in this.#peers) {
      this.#peers[peerId].close();
    }

    this.#peers = {};
    this.#peerMediaStreams = {};
  }

  private handleAddPeer(message: any) {
    const peerId = message.peerId as string;
    const shouldCreateOffer = message.shouldCreateOffer as boolean;

    console.log(`Adding peer '${peerId}'`);
    
    if (peerId in this.#peers) {
      console.log(`Already connected to peer '${peerId}'`);
      return;
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    });

    this.#peers[peerId] = peerConnection;
    
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.#socketHandler.send({
          type: "relayICECandidate",
          peerId: peerId,
          iceCandidate: {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate
          }
        });
      }
    }
  
    // @ts-ignore
    peerConnection.onaddstream = event => {
      this.#peerMediaStreams[peerId] = new P2PMediaStream({
        audio: true,
        video: true,
        muted: false
      });
      this.#peerMediaStreams[peerId].setup()
        .then(() => {
          if ("srcObject" in this.#peerMediaStreams[peerId].mediaElement) {
            this.#peerMediaStreams[peerId].mediaElement.srcObject = event.stream;
          } else {
            (this.#peerMediaStreams[peerId].mediaElement as any).src = window.URL.createObjectURL(event.stream); // for older browsers
          }
        });
    }

    // @ts-ignore
    peerConnection.addStream(this.#localMediaStream.mediaStream);

    if (shouldCreateOffer) {
        console.log(`Creating RTC offer to '${peerId}'`);

        peerConnection
          .createOffer()
          .then(description => {
            console.log(`Local offer description is`, description);

            peerConnection
              .setLocalDescription(description)
              .then(() => {
                this.#socketHandler.send({
                  type: "relaySessionDescription",
                  peerId: peerId,
                  sessionDescription: description
                });

                console.log(`Setting offer description successful.`);
              })
              .catch(error => {
                console.log(`Failed to set offer description.`, error);
              })
          })
          .catch(error => {
            console.log(`Error sending offer`, error);
          });
    }
  }

  private handleRemovePeer(message: any) {
    const peerId = message.peerId as string;

    console.log(`Removing peer '${peerId}'`);

    if (peerId in this.#peerMediaStreams) {
      this.#peerMediaStreams[peerId].remove();
    }

    if (peerId in this.#peers) {
        this.#peers[peerId].close();
    }

    delete this.#peers[peerId];
    delete this.#peerMediaStreams[peerId];
  }

  private handleSessionDescription(message: any) {
    const peerId = message.peerId as string;
    const sessionDescription = new RTCSessionDescription(message.sessionDescription);
    
    console.log('Remote description received: ', sessionDescription);

    const peer = this.#peers[peerId];

    peer.setRemoteDescription(sessionDescription)
      .then(() => {
        console.log(`Setting remote description for peer '${peerId}' succeeded!`);

        if (sessionDescription.type === "offer") {
          console.log("Creating answer");

          peer.createAnswer()
            .then(localSessionDescription => {
              console.log(`Answer description is `, localSessionDescription);

              peer.setLocalDescription(localSessionDescription)
                .then(() => {
                  this.#socketHandler.send({
                    type: "relaySessionDescription",
                    peerId: peerId,
                    sessionDescription: localSessionDescription
                  });

                  console.log(`Answer setting local description successful`);
                })
                .catch(error => {
                  console.log(`Failed to answer setting local description`, error);
                });
            })
            .catch(error => {
              console.log(`Error creating answer`, error)
            });
        }
      })
      .catch(error => {
        console.log(`Failed to set remote session description`, error);
      });
  }

  private handleICECandidate(message: any) {
    const peerId = message.peerId as string;
    const iceCandidate = message.iceCandidate as RTCIceCandidateInit;
    const peer = this.#peers[peerId];

    peer.addIceCandidate(new RTCIceCandidate(iceCandidate));
  }

  private joinChannel(channelName: string) {
    this.#socketHandler.send({
      type: "joinChannel",
      channel: channelName
    });
  }
}