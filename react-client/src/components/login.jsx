import React, { Component } from "react";
import "../App.css";

class Login extends Component {
  render() {
    return (
      <div>
        <div className="header">
          <h1>CORONA PARTY</h1>
        </div>

        <input type="text" placeholder="NAME" name="playername" required />
        <button type="submit">ENTER</button>
      </div>
    );
  }
}

export default Login;
