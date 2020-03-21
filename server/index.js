
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

console.log("Server running on port ", port)

const io = require("socket.io")(port, {
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
  MESSAGE: "MESSAGE",
  RTC_SIGNAL: "RTC-SIGNAL"
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

  // Handle user sending join message with his username
  socket.on(EVENTS.USER_JOIN, username => {
    users[socket.id].username = username;

    // Inform everyone about connection of user
    socket.emit(EVENTS.CONNECTED, username);
    socket.broadcast.emit(EVENTS.CONNECTED, username);
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

  // Broadcast msg to other clients
  socket.on(EVENTS.RTC_SIGNAL, msg => {
    socket.broadcast.emit(EVENTS.RTC_SIGNAL, msg);
  });
});
