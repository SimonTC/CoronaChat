import Peer from "../common/Peer";
import P2PMediaStream from "./P2PMediaStream";

export default class PeerController {
  #peer: Peer;
  #audioContext: AudioContext = new AudioContext();
  #mediaStream: P2PMediaStream;

  constructor(peer: Peer) {
    this.#peer = peer;
  }

  get peer() {
    return this.#peer;
  }
}