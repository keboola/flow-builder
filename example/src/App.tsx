import React from "react";
import "@keboola/flow-builder/dist/Graph.css";
import { Graph, Group, Node, Input, Output } from "@keboola/flow-builder";

const App = () => {
  return (
    <div
      style={{
        position: "relative",
        left: "20px",
        width: "50%",
        height: "50%"
      }}
    >
      <style>
        {`
        .content {
          width: 4em;
          height: 3em;
          text-align: center;
          line-height: 3em;
        }
        .flow-builder--node {
          border: 1px solid rgb(223, 225, 229);
          border-radius: 8px;
          box-shadow: 2px 2px 2px 1px rgba(245, 245, 245, 100);
        }
        .flow-builder--group {
          border: 1px solid rgb(223, 225, 229);
          border-radius: 8px;
          box-shadow: 2px 2px 4px 2px rgba(245, 245, 245, 200);
        }
        .flow-builder--group .flow-builder--node {
          border: none;
          box-shadow: none;
        }
        .flow-builder--io-port {
          
        }
        .flow-builder--io-port[data-name$="success"] {
          background-color: green;
        }
        `}
      </style>
      <Graph
        edges={["a.success->b+c+d.run0", "f.success->b+c+d.run1"]}
        calculatePath={(from, to) => {
          console.log(from, to);
          return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        }}
      >
        <Node name="a" position={[50, 50]}>
          <div className="content">Test</div>
          <Output name="success" />
        </Node>
        <Node name="f" position={[250, 50]}>
          <div className="content">Test</div>
          <Output name="success" />
        </Node>
        <Group name="b+c+d" position={[150, 150]}>
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
  );
};

export default App;
