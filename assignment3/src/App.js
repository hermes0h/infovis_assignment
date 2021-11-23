import React from "react";
// import Mainplot from "./components/Mainplot";

import raw from "./data/raw.json";
import attr from "./data/attr.json";

import ProjectionView from "./components/ProjectionView"

import "./App.css";


function App() {

  const name = "WonHyeon Kim";
  const studentNum = "2021-20552";

  const width = 1000;
  const height = 1000;
  const margin = 20;

  return (
    <div className="App">
      <div class="splotContainer">
        <ProjectionView
          width={width}
          height={height}
          margin={margin}
          data={raw}
          attr={attr}
        />
      </div>
    </div>
  );
}

export default App;
