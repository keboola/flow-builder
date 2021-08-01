import React from "react";
import { Graph, Group, Node, Input, Output } from "./graph"

const App = () => {
  return (
    <div style={{
      position: "relative",
      left: "20px",
      width: "100%",
      height: "100%"
    }}>
      <style>
        {`
        .content {
          width: 4em;
          height: 3em;
          text-align: center;
          line-height: 3em;
        }
        .flow-graph--node {
          border: 1px solid rgb(223, 225, 229);
          border-radius: 8px;
          box-shadow: 2px 2px 2px 1px rgba(245, 245, 245, 100);
        }
        .flow-graph--group {
          border: 1px solid rgb(223, 225, 229);
          border-radius: 8px;
          box-shadow: 2px 2px 4px 2px rgba(245, 245, 245, 200);
        }
        .flow-graph--group .flow-graph--node {
          border: none;
          box-shadow: none;
        }
        .flow-graph--io-port {
          
        }
        .flow-graph--io-port[data-name$="success"] {
          background-color: green;
        }
        `}
      </style>
      <Graph edges={[
        "a.success->b+c+d.run0",
        "f.success->b+c+d.run1",
      ]}>
        <Node align-x name="a" position={[50, 10]}>
          <div className="content">Test</div>
          <Output name="success" />
        </Node>
        <Node align-x name="f" position={[250, 10]}>
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