import React, { Component } from "react";
import CoronaPeer from "../corona-peer";

class Canvas extends Component {

  state = {
    participants: [
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
    ],
    selectedIndex: -1
  };

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;

    canvas.addEventListener("mousedown", this.mouseDown);
    canvas.addEventListener("mouseup", this.mouseUp);
    canvas.addEventListener("mousemove", this.mouseMove);

    this.updateCanvas();
  }

  setupMediaDevices() {
    const isInitiator = window.location.hash === "#1";

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
  }

  updateCanvas() {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.fillRect(0, 0, 1000, 700);
    /*ctx.fillStyle = "#FF0000";*/

    this.state.participants.forEach(this.drawParticipant);
  }

  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} width={1000} height={700} />
      </div>
    );
  }

  getMousePos(event) {
    const rect = this.canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  isInside(pos, p) {
    return (
      pos.x > p.posx && pos.x < p.posx + p.width && p.posy < p.posy + p.height && pos.y > p.posy
    );
  }

  drawParticipant = (p, index, self) => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.fillRect(p.posx, p.posy, p.width, p.height);
    ctx.fillStyle = p.color;
    ctx.font = "30px Arial";
    ctx.fillText(p.name, p.posx, p.posy);
    const closestConversation = this.calculateDistanceBetweenParticipants(p, index);
    ctx.fillText(`closest convo: ${closestConversation}`, p.posx + 30, p.posy + 30);
  }

  calculateDistanceBetweenParticipants(p, currentParticipant) {
    const currentPosition = { x: p.posx, y: p.posy };
    let closestDistance = 5000;
    this.state.participants.forEach((participant, index) => {
      if (currentParticipant !== index) {
        const distanceBetweenParticpants = Math.abs(
          Math.sqrt(
            Math.pow(currentPosition.x - participant.posx, 2) +
              Math.pow(currentPosition.y - participant.posy, 2)
          )
        );
        closestDistance =
          distanceBetweenParticpants < closestDistance
            ? distanceBetweenParticpants
            : closestDistance;
      }
    });
    if (closestDistance === 5000) {
      return "conversations are to far";
    }
    return closestDistance;
  }

  mouseDown = (evt) => {
    let mousePos = this.getMousePos(evt);
    if (this.isInside(mousePos, this.state.participants[0])) {
      this.setState( {selectedIndex: 0});
      console.log("mouse down " + this.state.participants[this.state.selectedIndex].name);
    }
  }

  mouseUp = (evt) => {
    console.log("mouse up");
    this.setState( {selectedIndex: -1});
  }

  mouseMove = (evt) => {
    const rect = this.canvasRef.current.getBoundingClientRect();
    if (this.state.selectedIndex >= 0) {
      console.log("mouse move");
      this.state.participants[this.state.selectedIndex].posx = evt.clientX - rect.left;
      this.state.participants[this.state.selectedIndex].posy = evt.clientY - rect.top;
      this.updateCanvas();
    }
  }
}

export default Canvas;
