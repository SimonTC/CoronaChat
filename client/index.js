/*const config = require("../config/index.json");

const ws = new WebSocket(`ws://localhost:${config.socketServerPort}`);

ws.onopen = () => {
  console.log('Connected to the signaling server');
}

ws.onerror = err => {
  console.error(err)
}
*/


function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
  };
}
function isInside(pos, p){
  return pos.x > p.posx && pos.x < p.posx+p.width && p.posy < p.posy+p.height && pos.y > p.posy
}

function clearCanvas()
{
  var ctx = canvas.getContext("2d");
  var rect = canvas.getBoundingClientRect();
  ctx.fillStyle = "#cecece";
  ctx.fillRect(rect.left, rect.top, rect.right, rect.bottom);
}

function drawParticipant( p, index) {
var ctx = canvas.getContext("2d");
//var rect = canvas.getBoundingClientRect();
ctx.fillStyle = p.color;
ctx.fillRect(p.posx, p.posy, p.width, p.height);
ctx.font = "30px Arial";
ctx.fillText(p.name, p.posx, p.posy);
}

function updateScreen()
{
  clearCanvas()
  participants.forEach(drawParticipant)
} 

function mouseDown(evt)
{
  var mousePos = getMousePos(canvas, evt);
  if (isInside(mousePos,participants[0])) {
      selectedIndex = 0
      console.log("mouse down " + participants[selectedIndex].name)
  }
} 

function mouseUp(evt)
{
  console.log("mouse up")
  selectedIndex = -1
} 

function mouseMove(evt)
{
  if(selectedIndex >= 0) {
    console.log("mouse move")
    var rect = canvas.getBoundingClientRect();
    participants[selectedIndex].posx=evt.clientX - rect.left
    participants[selectedIndex].posy=evt.clientY - rect.top
    updateScreen()
  } 
} 

// Main ...
let participants = [{name: "player", posx:20, posy:20, width:20, height:20, color:"#0000ff"}, {name: "guest", posx:200, posy:200, width:20, height:20, color: "#FF0000" }]
let selectedIndex = -1
let canvas = document.getElementById("myCanvas")
canvas.addEventListener('mousedown', mouseDown)
canvas.addEventListener('mouseup', mouseUp)
canvas.addEventListener('mousemove', mouseMove)
updateScreen()

