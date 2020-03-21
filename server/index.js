const io = require("socket.io")(3000, {
  path: "/chat",
  serveClient: false,
  cookie: "coronachat"
});

const users = [];

const EVENTS = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  USER_ADD: "USER_ADD",
  MOVE: "MOVE",
  MESSAGE: "MESSAGE",
  RTC_SIGNAL: "RTC-SIGNAL"
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

io.on("connection", socket => {
  Object.values(users).forEach(element => {
    var user = { name: element.name, position: element.position, socketid: socket.id };
    socket.broadcast.emit(EVENTS.USER_ADD, user);
    socket.emit(EVENTS.USER_ADD, user);
  });

  // Store user socket and world position in memory
  users[socket.id] = {
    socket: socket,
    position: { x: getRandomInt(500), y: getRandomInt(500) },
    name: "qwerty" + getRandomInt(500)
  };

  // Inform user privately that they are connected
  socket.emit(EVENTS.CONNECTED, socket.id);

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

  // Store move and broadcast to other clients
  socket.on(EVENTS.MOVE, user => {
    console.log("move server", user);
    users[socket.id].position = { posx: user.posx, posy: user.posy };
    socket.broadcast.emit(EVENTS.MOVE, user);
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
