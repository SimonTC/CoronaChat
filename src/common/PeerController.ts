import { Point } from './Structures';

export default class PeerController {
  #name: string;
  #socketId: string;
  #position: Point;
  #isOwner: boolean;

  constructor(options: {
    name: string,
    socketId: string,
    position: Point,
    isOwner?: boolean
  }) {
    this.#name = options.name;
    this.#socketId = options.socketId;
    this.#position = options.position;
    this.#isOwner = options.isOwner;
  }

  get isInstantiated() {
    return !!this.#socketId;
  }

  get name() {
    return this.#name;
  }

  get socketId() {
    return this.#socketId;
  }

  get position() {
    return this.#position;
  }

  get isOwner() {
    return this.#isOwner;
  }

  set position(point: Point) {
    this.#position.x = point.x;
    this.#position.y = point.y;
  }
}