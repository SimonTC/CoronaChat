const io = require("socket.io")(3000, {
  path: "/chat",
  serveClient: false,
  cookie: "coronachat"
});

const users = {};

const EVENTS = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  USER_JOIN: "USER_JOIN",
  MOVE: "MOVE",
  MESSAGE: "MESSAGE"
};

io.on("connection", socket => {
  // Store user socket and world position in memory
  users[socket.id] = {
    socket,
    position: {}
  };

  // Inform user privately that they are connected
  // Client should send a USER_JOIN message back with their username
  socket.emit(EVENTS.CONNECTED, "connection established");
  // socket.emit(EVENTS.USER_JOIN, "user joined");

  // Handle event when user is about to disconnect (for possible cleanups)
  socket.on("disconnecting", s => {
    // Do something maybe
  });

  // Handle disconnection of client
  socket.on("disconnect", s => {
    delete users[socket.id];
    socket.broadcast.emit(EVENTS.DISCONNECTED, socket.id);
  });

  // Log errors
  socket.on("error", console.error);

  // Handle user sending join message with his username
  socket.on(EVENTS.USER_JOIN, username => {
    console.log("join", username);
    users[socket.id].username = username;

    // Inform everyone about connection of user
    socket.broadcast.emit(EVENTS.USER_JOIN, socket.id);
  });

  // Store move and broadcast to other clients
  socket.on(EVENTS.MOVE, pos => {
    users[socket.id].position = pos;
    socket.broadcast.emit(EVENTS.MOVE, socket.id, pos);
  });

  // Broadcast msg to other clients
  socket.on(EVENTS.MESSAGE, msg => {
    console.log(msg);
    socket.broadcast.emit(EVENTS.MESSAGE, msg);
  });
});
