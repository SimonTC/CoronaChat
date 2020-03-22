import adapter from "webrtc-adapter";
import SocketHandler from "./SocketHandler";
import P2PChannel from "./P2PChannel";
import { createCanvas } from "./utils/CanvasUtils";
import { createLogin } from "./utils/LoginUtils";
import Room from "./Room";
import { CSpawnPeerCell } from "../common/Messages";
import RoomRenderer from "./RoomRenderer";

createLogin(username => {
  const socketHandler = new SocketHandler();
  const channel = new P2PChannel(socketHandler);
  
  const canvasElement = createCanvas();
  const renderer = new RoomRenderer(canvasElement);
  const room = new Room(socketHandler, renderer);

  socketHandler.on("connected", () => {
    const message: CSpawnPeerCell = {
      type: "spawnPeerCell",
      name: username
    };

    socketHandler.send(message);

    renderer.start();
  });
});
