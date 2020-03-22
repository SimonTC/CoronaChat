import { Point } from '../../common/Structures';

export function createCanvas(): HTMLCanvasElement {
  const canvasHtmlElement = window.document.querySelector(".js-room-canvas") as HTMLCanvasElement;

  setDefaultSize(canvasHtmlElement);

  window.addEventListener('resize', () => setDefaultSize(canvasHtmlElement));

  // Disable right mouse click
  canvasHtmlElement.addEventListener("contextmenu", event => event.preventDefault());

  return canvasHtmlElement;
}

export function drawPeerCell(context: CanvasRenderingContext2D, name: string, position: Point, isOwner: boolean, mood: string, radius = 50) {
  context.beginPath();
  context.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
  context.fillStyle = isOwner ? 'green' : 'orange';
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = '#003300';
  context.stroke();

  context.font = "bold 18px sans-serif";
  context.fillStyle = "#eee";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(name, position.x, position.y-10;
  context.font = "bold 14px sans-serif";
  context.fillStyle = 'cyan';
  context.fillText(mood, position.x, position.y+10);

}

export function drawGrid(context: CanvasRenderingContext2D, padding = -20, tileSize = 80) {
  const windowWidth = getWindowWidth();
  const windowHeight = getWindowHeight();

  for (var x = 0; x <= windowWidth; x += tileSize) {
      context.moveTo(0.5 + x + padding, padding);
      context.lineTo(0.5 + x + padding, windowHeight + padding);
  }

  for (var x = 0; x <= windowHeight; x += tileSize) {
      context.moveTo(padding, 0.5 + x + padding);
      context.lineTo(windowWidth + padding, 0.5 + x + padding);
  }

  context.lineWidth = 1;
  context.strokeStyle = "#ccc";
  context.stroke();
}

function setDefaultSize(canvasHtmlElement: HTMLCanvasElement) {
  canvasHtmlElement.width = getWindowWidth();
  canvasHtmlElement.height = getWindowHeight();
}

function getWindowWidth() {
  return window.innerWidth && document.documentElement.clientWidth
    ? Math.min(window.innerWidth, document.documentElement.clientWidth)
    : window.innerWidth ||
    document.documentElement.clientWidth ||
    document.getElementsByTagName('body')[0].clientWidth;
}

function getWindowHeight() {
  return window.innerHeight && document.documentElement.clientHeight
    ? Math.min(window.innerHeight, document.documentElement.clientHeight)
    : window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName('body')[0].clientHeight;
}