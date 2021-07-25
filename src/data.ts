export type NodeBase = { id: string; content: any };

export type SimpleNode = NodeBase & { type: "node"; pos: [number, number] };
export type GroupNode = { id: string; type: "group"; pos: [number, number]; nodes: NodeBase[] };

export type NodeData = SimpleNode | GroupNode;

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
    for (let i = 0; i < data.nodes.length; ++i) {
      const node = data.nodes[i];
      const newNode = { ...node };
      newNode.pos = [newNode.pos[0], newNode.pos[1]];
      if (newNode.type === "group") {
        const prev = newNode.nodes;
        newNode.nodes = Array(prev.length);
        for (let j = 0; j < prev.length; ++j) {
          newNode.nodes[j] = { ...prev[j] };
        }
      }
      out.nodes[i] = newNode;
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
