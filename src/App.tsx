import React, { useState } from "react";
import Graph from "./Graph";
import type { GraphData } from "./data";

const storageKey = "nodeData";

const Test = (props: {/*  onClick: (evt: React.MouseEvent) => void  */ }) => {
  return (
    <div className="node-content-test">
      {/* <button {...props} className="remove-node">x</button> */}
      flow-builder
    </div>
  );
}

export default () => {
  const [data, setData] = useState({
    nodes: [
      { type: "node", id: "a", pos: [7, 1], content: <Test /> },
      { type: "node", id: "b", pos: [1, 7], content: <Test /> },
      { type: "node", id: "c", pos: [13, 7], content: <Test /> },
      { type: "node", id: "d", pos: [7, 13], content: <Test /> },
      {
        type: "group", id: "e+f+g", pos: [3, 20], nodes: [
          { id: "e", content: <Test /> },
          { id: "f", content: <Test /> },
          { id: "g", content: <Test /> },
        ]
      },
    ],
    edges: [
      { from: "a", to: "b" }
    ]
  } as GraphData);
  return (
    <>
      {/* <button className="add-node">+</button> */}
      <Graph
        id="graph"
        cellSize={25}
        data={data}
        onUpdate={newData => setData(newData)}
      />
    </>
  );
};
