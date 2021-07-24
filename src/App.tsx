import React, { useState } from "react";
import Graph from "./Graph";
import type { GraphData } from "./data";

const storageKey = "nodeData";

const defaultData: GraphData = {
  nodes: [
    { id: "a", pos: [4, 1], content: <span>flow-builder</span> },
    { id: "b", pos: [1, 4], content: <span>flow-builder</span> },
    { id: "c", pos: [7, 4], content: <span>flow-builder</span> },
    { id: "d", pos: [4, 7], content: <span>flow-builder</span> }
  ],
  edges: [
    { from: "a", to: "b" }
  ]
};

function load(): GraphData {
  const nodeData = localStorage.getItem(storageKey);
  return nodeData ? JSON.parse(nodeData) : defaultData;
}

function save(data: GraphData) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

export default () => {
  const [data, setData] = useState(load());
  return (
    <Graph
      id="graph"
      cellSize={25}
      data={data}
      onUpdate={(data) => {
        //save(data);
        setData(data);
      }}
    />
  );
};
