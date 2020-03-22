import { EventEmitter } from "../common/EventEmitter";

type SocketHandlerEventType = "connected" | "disconnected" | string;

export default class SocketHandler extends EventEmitter<SocketHandlerEventType> {
  #socket: WebSocket;

  constructor() {
    super();

    this.#socket = new WebSocket(`ws://corona.local:3000`);

    this.#socket.onopen = event => {
      console.log("Connected to signaling server");

      this.#socket.onmessage = this.handleMessage.bind(this);

      this.fire("connected");
    };

    this.#socket.onclose = () => {
      console.log("Disconnected from signaling server");
      
      this.fire("disconnected");
    }
  }

  send(message: any) {
    this.#socket.send(JSON.stringify(message));
  }

  private handleMessage(message: MessageEvent) {
    let payload;

    try {
      payload = JSON.parse(message.data);

    } catch (error) {
      console.error(`Failed to parse payload`, message.data);
    }

    this.fire(payload.type, payload);
  }

}