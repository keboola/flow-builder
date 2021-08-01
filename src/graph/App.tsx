import React from "react";
import { Graph, Group, Node } from "."

// TODO: Edges

const App = () => {
  return (
    <div style={{
      position: "relative",
      left: "20px",
      width: "100%",
      height: "100%"
    }}>
      <Graph edges={[
        "a.success->b+c+d.run"
      ]}>
        <Node align-x id="a" position={[50, 10]} outputs={["success"]}>
          <span>Test</span>
        </Node>
        <Group align-x id="b+c+d" position={[300, 100]} inputs={["run"]}>
          <Node id="b">
            <span>Test</span>
          </Node>
          <Node id="c">
            <span>Test</span>
          </Node>
          <Node id="d">
            <span>Test</span>
          </Node>
        </Group>
      </Graph>
    </div>
  )
}

export default App;