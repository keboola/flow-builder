import React from "react";
import { Graph, Group, Node, Input, Output } from "./graph"

// TODO: Edges

const App = () => {
  return (
    <div style={{
      position: "relative",
      left: "20px",
      width: "100%",
      height: "100%"
    }}>
      <style>
        {`div.content { width: 50px; height: 50px; text-align: center; line-height: 50px; }`}
      </style>
      <Graph edges={[
        "a.success->b+c+d.run0",
        "f.success->b+c+d.run1",
      ]}>
        <Node align-x name="a" position={[50, 10]}>
          <div className="content">Test</div>
          <Output name="success" />
        </Node>
        <Node name="f" position={[250, 10]}>
          <div className="content">Test</div>
          <Output name="success" />
        </Node>
        <Group align-x name="b+c+d" position={[150, 100]}>
          <Input name="run0" />
          <Input name="run1" />
          <Node name="b">
            <div className="content">Test</div>
          </Node>
          <Node name="c">
            <div className="content">Test</div>
          </Node>
          <Node name="d">
            <div className="content">Test</div>
          </Node>
        </Group>
      </Graph>
    </div>
  )
}

export default App;