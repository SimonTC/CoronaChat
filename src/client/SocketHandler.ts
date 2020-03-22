import { EventEmitter } from "../common/EventEmitter";
import config from '../common/config';

type SocketHandlerEventType = "connected" | "disconnected" | string;

export default class SocketHandler extends EventEmitter<SocketHandlerEventType> {
  #socket: WebSocket;

  constructor() {
    super();

    this.#socket = new WebSocket(this.socketServerUrl);

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

  get socketServerUrl() {
    const port = process.env.PORT || config.socketServerPort;

    if (process.env.NODE_ENV === 'development') {
      return `ws://${window.location.hostname}:${port}`;
    }
    
    return `ws://${window.location.hostname}`;
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