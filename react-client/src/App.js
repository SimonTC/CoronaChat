import React from "react";
import "./App.css";
import Login from "./components/login";
import Canvas from "./components/canvas";
import { participants } from "./state/participants";

function App() {
  return (
    <div className="App">
      <Login />
      <Canvas participants={participants} />
    </div>
  );
}

export default App;
