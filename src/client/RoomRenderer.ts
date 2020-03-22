import Peer from "../common/Peer";
import { drawGrid, drawPeerCell } from "./utils/CanvasUtils";
import { pointIntersectsCircle } from "./utils/MathUtils";
import { EventEmitter } from "../common/EventEmitter";
import { Point } from "../common/Structures";

const PEER_CELL_RADIUS = 50;

type RendererEventType = "peerCellMove" | "updatePeerMood";

export default class RoomRenderer extends EventEmitter<RendererEventType> {
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #peers: Peer[] = [];
  #lastUpdate: number;
  #loopHandle: number;

  #draggingPeer: Peer = null;

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.#canvas = canvas;
    this.#context = canvas.getContext("2d");

    this.setupCanvasEvents();
  }

  start() {
    this.loopRender(Date.now());
  }

  addPeer(peer: Peer) {
    this.#peers.push(peer);
  }

  removePeer(socketId: string) {
    const peerIndex = this.#peers.findIndex(peer => peer.socketId === socketId);
    if (peerIndex !== -1) {
      this.#peers.splice(peerIndex, 1);
    }
  }

  updatePeerPosition(socketId: string, position: Point) {
    const foundPeer = this.#peers.find(peer => peer.socketId === socketId);
    if (foundPeer) {
      foundPeer.position = position;
    }
  }

  updatePeerMood(socketId: string, mood: string) {
    const foundPeer = this.#peers.find(peer => peer.socketId === socketId);
    if (foundPeer) {
      foundPeer.mood = mood;
    }
  }

  private loopRender(timestamp: number) {
    this.#loopHandle = window.requestAnimationFrame(time => this.loopRender(time));
    
    let deltaT = 0;
    if (this.#lastUpdate) {
      deltaT = timestamp - this.#lastUpdate;
    }

    this.render(deltaT);

    this.#lastUpdate = timestamp;
  }

  private render(deltaT: number) {
    this.clear();

    drawGrid(this.#context);

    this.#peers.forEach(peer => {
      if (peer.isInstantiated) {
        drawPeerCell(this.#context, peer.name, peer.position, peer.isOwner, peer.mood, PEER_CELL_RADIUS)
      }
    });
  }

  private clear() {
    this.#context.clearRect(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );
  }

  private setupCanvasEvents() {
    window.addEventListener('resize', () => this.render());

    this.#canvas.addEventListener("mousedown", event => {
      const mousePosition = {
        x: event.clientX,
        y: event.clientY
      };

      const ownedPeer = this.#peers.find(peer => peer.isOwner);
      if (ownedPeer && pointIntersectsCircle(mousePosition, ownedPeer.position, PEER_CELL_RADIUS)) {
        this.#draggingPeer = ownedPeer;
      }
    });

    this.#canvas.addEventListener("mousemove", event => {
      if (this.#draggingPeer) {
        this.#draggingPeer.position = {
          x: event.x,
          y: event.y
        };

        this.fire("peerCellMove", this.#draggingPeer.position);

        this.render();
      }
    });

    this.#canvas.addEventListener("mouseup", event => {
      if (this.#draggingPeer) {
        this.fire("peerCellMove", this.#draggingPeer.position);

        this.#draggingPeer = null;
      }
    });
    
    var selectmood = document.getElementById("moodselector");
    selectmood.addEventListener("change", event => {
      const target = event.target as HTMLSelectElement;

      selectmood.style.visibility = "hidden"

      const ownedPeer = this.#peers.find(peer => peer.isOwner);
      if (ownedPeer) {
        ownedPeer.mood = target.value;

        this.fire("updatePeerMood", ownedPeer.mood);

        this.render();
      }
    });

    this.#canvas.addEventListener("contextmenu", event => {
      const ownedPeer = this.#peers.find(peer => peer.isOwner);
      if (ownedPeer) {
        const mousePosition = {
          x: event.clientX,
          y: event.clientY
        };
  
        if (pointIntersectsCircle(mousePosition, ownedPeer.position, PEER_CELL_RADIUS)) {
          selectmood.style.visibility = "visible"
          selectmood.style.top = (event.y- selectmood.clientHeight/2).toString()
          selectmood.style.left = (event.x -selectmood.clientWidth/2).toString()   
        }
      }
    });
  }
}