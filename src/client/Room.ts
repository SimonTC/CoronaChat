import Peer from "../common/Peer";
import { CUpdatePeerCellPosition, CUpdatePeerMood, SUpdatePeerMood, IRemovePeer, SSpawnPeerCell, SUpdatePeerCellPosition } from "../common/Messages";
import { Point } from "../common/Structures";
import SocketHandler from "./SocketHandler";
import RoomRenderer from "./RoomRenderer";
import PeerController from "./PeerController";

export default class Room {
  #socketHandler: SocketHandler;
  #renderer: RoomRenderer;
  #peerControllers: {
    [socketId: string]: PeerController
  } = {};

  constructor(socketHandler: SocketHandler, renderer: RoomRenderer) {
    this.#socketHandler = socketHandler;
    this.#renderer = renderer;

    this.#renderer.on("peerCellMove", (position: Point) => this.sendUpdatePeerPositionMessage(position));
    this.#renderer.on("updatePeerMood", (mood: string) => this.sendUpdatePeerMoodMessage(mood));

    this.setupSocketHandlerEvents();
  }

  private setupSocketHandlerEvents() {
    this.#socketHandler.on("removePeer", (message: IRemovePeer) => {
      if (this.#peerControllers[message.socketId]) {
        delete this.#peerControllers[message.socketId];
      }

      this.#renderer.removePeer(message.socketId);
    });
  
    this.#socketHandler.on("spawnPeerCell", (message: SSpawnPeerCell) => {
      const peer = new Peer({
        name: message.name,
        socketId: message.ownerId,
        isOwner: message.isOwner,
        position: message.position,
        mood: message.mood
      });

      this.#renderer.addPeer(peer);
      
      this.#peerControllers[message.ownerId] = new PeerController(peer);
    });
  
    this.#socketHandler.on("updatePeerCellPosition", (message: SUpdatePeerCellPosition) => {
      this.#renderer.updatePeerPosition(message.socketId, message.position);
    });

    this.#socketHandler.on("updatePeerMood", (message: SUpdatePeerMood) => {
      this.#renderer.updatePeerMood(message.socketId, message.mood);
    });
  }

  private sendUpdatePeerPositionMessage(position: Point) {
    const message: CUpdatePeerCellPosition = {
      type: "updatePeerCellPosition",
      position
    };

    this.#socketHandler.send(message);
  }

  private sendUpdatePeerMoodMessage(mood: string) {
    const message: CUpdatePeerMood = {
      type: "updatePeerMood",
      mood
    };

    this.#socketHandler.send(message);
  }

}