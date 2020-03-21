import React, { Component } from "react";
import "../App.css";
import {addParticipant} from "../state/participants";

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {playerName: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    //alert('Your favorite flavor is: ' + this.state.playerName);

    const user = {
      name: this.state.playerName,
      position: {
        posx: 100,
        posy: 100,
      },
    };

    addParticipant(user);
    event.preventDefault();
  }

  handleChange(event){
    this.setState({playerName: event.target.value});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="header">
          <h1>CORONA PARTY</h1>
        </div>

        <input type="text" placeholder="NAME" name="playername" onChange={this.handleChange} required/>
        <button type="submit">ENTER</button>
      </form>
    );
  }
}

export default Login;
