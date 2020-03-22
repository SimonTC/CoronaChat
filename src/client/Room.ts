import PeerController from "../common/PeerController";
import { SSpawnPeerCell, CUpdatePeerCellPosition, SUpdatePeerCellPosition, IRemovePeer } from "../common/Messages";
import { SSpawnPeerCell, CUpdatePeerCellPosition, SUpdatePeerCellPosition, CUpdatePeerMood, SUpdatePeerMood, IRemovePeer } from "../common/Messages";
import { drawPeerCell, drawGrid } from "./utils/CanvasUtils";
import { Point } from '../common/Structures';
import SocketHandler from './SocketHandler';

const CELL_RADIUS = 50;

export default class Room {
  #socketHandler: SocketHandler;
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #peerControllers: {
    [socketId: string]: PeerController
  } = {};

  #draggingPeer: PeerController;

  constructor(socketHandler: SocketHandler, canvas: HTMLCanvasElement) {
    this.#socketHandler = socketHandler;
    this.#canvas = canvas;
    this.#context = canvas.getContext("2d");

    this.setupSocketHandlerEvents();
    this.setupCanvasEvents();
  }

  render() {
    this.clear();

    drawGrid(this.#context);

    for (const socketId in this.#peerControllers) {
      if (this.#peerControllers[socketId].isInstantiated) {
        drawPeerCell(this.#context, this.#peerControllers[socketId].name, this.#peerControllers[socketId].position, this.#peerControllers[socketId].isOwner, this.#peerControllers[socketId].mood, CELL_RADIUS);
      }
    }
  }

  clear() {
    this.#context.clearRect(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );
  }

  private setupSocketHandlerEvents() {
    this.#socketHandler.on("spawnPeerCell", (message: SSpawnPeerCell) => {
      const peerController = new PeerController({
        name: message.name,
        socketId: message.ownerId,
        isOwner: message.isOwner,
        position: message.position,
        mood: message.mood
      });

      this.#peerControllers[message.ownerId] = peerController;

      this.render();
    });

    this.#socketHandler.on("updatePeerCellPosition", (message: SUpdatePeerCellPosition) => {
      this.#peerControllers[message.socketId].position = message.position;

      this.render();
    });

    this.#socketHandler.on("removePeer", (message: IRemovePeer) => {
      if (this.#peerControllers[message.socketId]) {
        delete this.#peerControllers[message.socketId];
      }

      this.render();
    });

    this.#socketHandler.on("updatePeerMood", (message: SUpdatePeerMood) => {
      this.#peerControllers[message.socketId].mood = message.mood;

      this.render();
    });
  }

  private setupCanvasEvents() {
    window.addEventListener('resize', () => this.render());

    this.#canvas.addEventListener("mousedown", event => {
      const mousePosition = {
        x: event.clientX,
        y: event.clientY
      };

      for (const socketId in this.#peerControllers) {
        const peerController = this.#peerControllers[socketId];

        if (peerController.isOwner && this.intersects(mousePosition, peerController.position)) {
          this.#draggingPeer = peerController;
        }
      }
    });

    this.#canvas.addEventListener("mousemove", event => {
      if (this.#draggingPeer) {
        this.#draggingPeer.position = {
          x: event.x,
          y: event.y
        };

        this.updatePeerPosition(this.#draggingPeer.position);

        this.render();
      }
    });

    this.#canvas.addEventListener("mouseup", event => {
      if (this.#draggingPeer) {
        this.updatePeerPosition(this.#draggingPeer.position);
  
        this.#draggingPeer = null;
      }
    });
    
    var selectmood = document.getElementById("moodselector");
    selectmood.addEventListener("change", event => {
      //console.log("name: " + event.target.value + ", value: ")
      selectmood.style.visibility = "hidden"
      Object.values(this.#peerControllers).forEach(element => {
        if(element.isOwner) {
            element.mood = event.target.value;
            this.updatePeerMood(event.target.value)
            this.render();
        }
      });
    });

    this.#canvas.addEventListener("contextmenu", event => {
      console.log("context");
      var ownedPeer = this.getOwnedPeer();
      console.log(ownedPeer);
      if(ownedPeer === undefined) return;
      const mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      console.log("mouse");
      if (this.intersects(mousePosition, ownedPeer.position)) {
        selectmood.style.visibility = "visible"
        selectmood.style.top = (event.y- selectmood.clientHeight/2).toString()
        selectmood.style.left = (event.x -selectmood.clientWidth/2).toString()   
      }
    });
  }

  private updatePeerPosition(position: Point) {
    const message: CUpdatePeerCellPosition = {
      type: "updatePeerCellPosition",
      position
    };

    this.#socketHandler.send(message);
  }

  private updatePeerMood(mood: string) {
    const message: CUpdatePeerMood = {
      type: "updatePeerMood",
      mood
    };

    this.#socketHandler.send(message);
  }

  private intersects(point: Point, circleCenter: Point, radius = CELL_RADIUS) {
    return Math.sqrt((point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2) < radius;
  }

  private getOwnedPeer() : PeerController {
    let returnElement = undefined;
    Object.values(this.#peerControllers).forEach(element => {
      console.log(element.isOwner)
      if(element.isOwner) {
        returnElement = element;
      }
    });
    return returnElement
  }

}