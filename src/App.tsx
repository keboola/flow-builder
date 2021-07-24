import React, { useState } from "react";
import Graph from "./Graph";
import type { GraphData } from "./data";

const storageKey = "nodeData";

const defaultData: GraphData = {
  nodes: [
    { id: "a", pos: [10 + 3, 1], content: <span>Test</span> },
    { id: "b", pos: [10 + 1, 4], content: <span>Test</span> },
    { id: "c", pos: [10 + 5, 4], content: <span>Test</span> },
    { id: "d", pos: [10 + 3, 7], content: <span>Test</span> }
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
