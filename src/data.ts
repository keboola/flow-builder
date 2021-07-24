import type { ReactElement } from "react";

export interface NodeData {
  id: string;
  pos: [number, number];
  content: ReactElement;
}
export interface EdgeData {
  from: string;
  to: string;
}
export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export namespace GraphData {
  export function copy(data: GraphData): GraphData {
    const out: GraphData = {
      nodes: Array(data.nodes.length),
      edges: Array(data.edges.length)
    };
    for (let i = 0, len = data.nodes.length; i < len; ++i) {
      const node = data.nodes[i];
      out.nodes[i] = {
        id: node.id,
        pos: [node.pos[0], node.pos[1]],
        content: node.content
      };
    }
    for (let i = 0, len = data.edges.length; i < len; ++i) {
      const edge = data.edges[i];
      out.edges[i] = {
        from: edge.from,
        to: edge.to
      };
    }
    return out;
  }
}
