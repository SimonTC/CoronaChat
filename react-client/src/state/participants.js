export const participants = [
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
};
