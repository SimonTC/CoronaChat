import CoronaPeer from "./corona-peer";

// TODO: We should determine whether client is initiator or not through websockets
const isInitiator = location.hash === "#1";

navigator.mediaDevices
  .getUserMedia({
    video: false,
    audio: true
  })
  .then(mediaStream => {
    const peer = new CoronaPeer(isInitiator, mediaStream);
  })
  .catch(error => {
    console.error(error);
  });

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();

function getMousePos(event) {
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}
function isInside(pos, p) {
  return pos.x > p.posx && pos.x < p.posx + p.width && p.posy < p.posy + p.height && pos.y > p.posy;
}

function clearCanvas() {
  ctx.fillStyle = "#cecece";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawParticipant(p, index, self) {
  ctx.fillStyle = p.color;
  ctx.fillRect(p.posx, p.posy, p.width, p.height);
  ctx.font = "30px Arial";
  ctx.fillText(p.name, p.posx, p.posy);
  const closestConversation = calculateDistanceBetweenParticipants(p, index, self);
  ctx.fillText(`closest convo: ${closestConversation}`, p.posx + 30, p.posy + 30);
}

function calculateDistanceBetweenParticipants(p, currentParticipant, participants) {
  const currentPosition = { x: p.posx, y: p.posy };
  let closestDistance = 5000;
  participants.forEach((particpant, index) => {
    if (currentParticipant !== index) {
      const distanceBetweenParticpants = Math.abs(
        Math.sqrt(
          Math.pow(currentPosition.x - particpant.posx, 2) +
            Math.pow(currentPosition.y - particpant.posy, 2)
        )
      );
      closestDistance =
        distanceBetweenParticpants < closestDistance ? distanceBetweenParticpants : closestDistance;
    }
  });
  if (closestDistance === 5000) {
    return "conversations are to far";
  }
  return closestDistance;
}

function updateScreen() {
  clearCanvas();
  participants.forEach(drawParticipant);
}

function mouseDown(evt) {
  let mousePos = getMousePos(evt);
  if (isInside(mousePos, participants[0])) {
    selectedIndex = 0;
    console.log("mouse down " + participants[selectedIndex].name);
  }
}

function mouseUp(evt) {
  console.log("mouse up");
  selectedIndex = -1;
}

function mouseMove(evt) {
  if (selectedIndex >= 0) {
    console.log("mouse move");
    participants[selectedIndex].posx = evt.clientX - rect.left;
    participants[selectedIndex].posy = evt.clientY - rect.top;
    updateScreen();
  }
}

// Main ...
let participants = [
  {
    name: "player",
    posx: 20,
    posy: 20,
    width: 20,
    height: 20,
    color: "#0000ff"
  },
  {
    name: "guest",
    posx: 200,
    posy: 200,
    width: 20,
    height: 20,
    color: "#FF0000"
  }
];

export const addParticipant = user => {
  console.log("add user: " + user.name);
  participants.push({
    name: user.name,
    posx: user.position.x,
    posy: user.position.y,
    width: 20,
    height: 20,
    color: "#FF0000"
  });
  updateScreen();
  document.getElementById('beep').play();
};

let selectedIndex = -1;

canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);
updateScreen();
