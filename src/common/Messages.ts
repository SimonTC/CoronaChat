export interface CSpawnPeerCell {
  type: "spawnPeerCell",
  name: string
}

export interface SSpawnPeerCell {
  type: "spawnPeerCell",
  socketId: string,
  ownerId: string,
  isOwner: boolean,
  name: string,
  position: {
    x: number,
    y: number
  }
}

export interface CUpdatePeerCellPosition {
  type: "updatePeerCellPosition",
  position: {
    x: number,
    y: number,
  }
}

export interface SUpdatePeerCellPosition {
  type: "updatePeerCellPosition",
  socketId: string,
  position: {
    x: number,
    y: number,
  }
}