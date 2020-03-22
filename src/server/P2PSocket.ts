import { WebSocket } from "ws";
import MessageHandler from "server/MessageHandler";
import PeerController from 'common/PeerController';

export type P2PChannelCollection = {
  [key: string]: string
};

export type P2PSocket = WebSocket & {
  id: string,
  messageHandler: MessageHandler,
  peerController: PeerController,
  channels: P2PChannelCollection
};