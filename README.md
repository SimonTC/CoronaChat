## How to run

### Starting client and server
Install dependencies with `npm install`.

Start watching both, server and client, run `npm start`.

Run server or client individually with `npm run start-server` or `npm run start-client` commands respectively.

### Making a connection between two peers
1. Navigate to http://localhost:1234/ - this will register the browser window as a peer that can receive p2p connections
2. Navigate to http://localhost:1234/#1 in another browser window - this will register the window as a peer that would like to connect to another peer
3. A audio connection is created between the two browser windows. Now listen to lovely echo as you speak with yourself.

Note: I don't think it currently is possible to connect more than two peers with this setup. 
See https://github.com/feross/simple-peer#connecting-more-than-2-peers on how to connect more than two peers. 

## Technologies used

### Front end
- WebRTC to connect clients (using https://github.com/feross/simple-peer)

### Backend
- Node js
- Web sockets (https://github.com/websockets/ws)
