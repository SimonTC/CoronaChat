// Server setup
// const server = require("http").createServer(req => {});
// server.listen(3000, () => {
//   console.log("Listening on 3000");
// });

const io = require("socket.io")(3000, {
  path: "/chat",
  serveClient: false,
  cookie: "coronachat"
});

const users = {};

const EVENTS = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  MOVE: "MOVE",
  MESSAGE: "MESSAGE"
};

io.on("connection", socket => {
  // Store user socket and world position in memory
  users[socket.id] = {
    socket,
    position: {}
  };

  // Inform everyone about connection of user
  socket.emit(EVENTS.CONNECTED, socket.id);
  socket.broadcast.emit(EVENTS.CONNECTED, socket.id);

  // Handle event when user is about to disconnect (for possible cleanups)
  socket.on("disconnecting", s => {
    // Do something maybe
  });

  // Handle disconnection of client
  socket.on("disconnect", s => {
    delete users[socket.id];
    socket.emit(EVENTS.DISCONNECTED, socket.id);
    socket.broadcast.emit(EVENTS.DISCONNECTED, socket.id);
  });

  // Log errors
  socket.on("error", console.error);

  // Store move and broadcast to other clients
  socket.on(EVENTS.MOVE, pos => {
    users[socket.id].position = pos;
    socket.broadcast.emit(EVENTS.MOVE, socket.id, pos);
  });

  // Broadcast msg to other clients
  socket.on(EVENTS.MESSAGE, msg => {
    socket.broadcast.emit(EVENTS.MESSAGE, msg);
  });
});
