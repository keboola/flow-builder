import React, { useState } from "react";
import Graph, { NodeData } from "./Graph";

const storageKey = "nodeData";

function load(): NodeData[] {
  const nodeData = localStorage.getItem(storageKey);
  if (nodeData) {
    return JSON.parse(nodeData);
  } else {
    return [
      { id: "a", pos: [3, 1], size: [2, 2], edges: ["b", "c"] },
      { id: "b", pos: [1, 4], size: [2, 2], edges: ["d"] },
      { id: "c", pos: [5, 4], size: [2, 2], edges: ["d"] },
      { id: "d", pos: [3, 7], size: [2, 2] }
    ];
  }
}

function save(nodeData: NodeData[]) {
  localStorage.setItem(storageKey, JSON.stringify(nodeData));
}

export default () => {
  const [nodes, setNodes] = useState(load());
  return (
    <Graph
      nodes={nodes}
      onNodesUpdate={(data) => {
        save(data);
        setNodes(data);
      }}
    />
  );
};
