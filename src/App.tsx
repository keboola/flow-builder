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
        <Node align-x id="a" position={[50, 10]}>
          <div className="content">Test</div>
          <Output id="success"></Output>
        </Node>
        <Node id="f" position={[250, 10]}>
          <div className="content">Test</div>
          <Output id="success"></Output>
        </Node>
        <Group align-x id="b+c+d" position={[150, 100]}>
          <Input id="run0"></Input>
          <Input id="run1"></Input>
          <Node id="b">
            <div className="content">Test</div>
          </Node>
          <Node id="c">
            <div className="content">Test</div>
          </Node>
          <Node id="d">
            <div className="content">Test</div>
          </Node>
        </Group>
      </Graph>
    </div>
  )
}

export default App;