const config = require("../config/index.json");

const ws = new WebSocket(`ws://localhost:${config.socketServerPort}`);

ws.onopen = () => {
  console.log('Connected to the signaling server');
}

ws.onerror = err => {
  console.error(err)
}