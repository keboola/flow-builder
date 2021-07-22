import React, { createRef } from "react";
import "./Graph.css";
import Node from "./Node";
import GhostNode from "./GhostNode";

export interface NodeData {
  id: string;
  pos: [number, number];
  size: [number, number];
  edges?: string[];
}

function calculateEdgePath(from: NodeData, to: NodeData, scale: { x: number; y: number }) {
  const start = [
    from.pos[0] * scale.x + (from.size[0] * scale.x) / 2,
    from.pos[1] * scale.y + from.size[1] * scale.y
  ];
  const end = [to.pos[0] * scale.x + (to.size[0] * scale.x) / 2, to.pos[1] * scale.y];

  return `M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`;
}

function copyNodeData(data: NodeData[]): NodeData[] {
  const out: NodeData[] = [];
  for (let i = 0, len = data.length; i < len; ++i) {
    const node = data[i];
    out[i] = {
      id: node.id,
      pos: [node.pos[0], node.pos[1]],
      size: [node.size[0], node.size[1]]
    };
    if (node.edges) {
      out[i].edges = [...node.edges];
    }
  }
  return out;
}

export type Props = {
  nodes: NodeData[];
  /** Called when user adds/removes node/edge or moves node */
  onNodesUpdate: (data: NodeData[]) => void;
  /** Pixels per unit */
  scale?: { x: number; y: number };
};
type State = {
  width: number;
  height: number;
  scale: { x: number; y: number };
  ghostNode: JSX.Element | null;
};
export default class Graph extends React.Component<Props, State> {
  private ghostNodeRef: GhostNode | null = null;

  constructor(props: typeof Graph.prototype.props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      scale: this.props.scale ?? { x: 25, y: 25 },
      ghostNode: null
    };
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.handleMouseUp, false);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleMouseUp, false);
  }

  render() {
    return (
      <div className="graph-container">
        {this.renderGraph()}
        {this.state.ghostNode}
      </div>
    );
  }

  renderGraph() {
    // TODO: memoize this
    const references = new Set<string>();
    const paths: JSX.Element[] = [];
    for (const node of this.props.nodes) {
      for (const edgeId of node.edges ?? []) {
        references.add(edgeId);
        const from = node;
        const to = this.props.nodes.find((other) => other.id === edgeId);
        if (!to) throw new Error(`Invalid edge to ${edgeId} in node ${node.id}`);
        paths.push(
          <path
            key={node.id + edgeId}
            d={calculateEdgePath(from, to, this.state.scale)}
            stroke="black"
            fill="transparent"
          />
        );
      }
    }

    return (
      <>
        <svg style={{ zIndex: -1 }}>{...paths}</svg>
        {...this.props.nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            position={[node.pos[0] * this.state.scale.x, node.pos[1] * this.state.scale.y]}
            size={[node.size[0] * this.state.scale.x, node.size[1] * this.state.scale.y]}
            hasInput={references.has(node.id)}
            hasOutput={(node.edges?.length ?? 0) > 0}
            onMouseDown={this.handleMouseDown}
          >
            <span>Test</span>
          </Node>
        ))}
      </>
    );
  }

  handleMouseDown = (id: string, evt: React.MouseEvent) => {
    const target = this.props.nodes.find((node) => node.id === id);
    if (!target) return;

    if (this.state.ghostNode || this.ghostNodeRef) return;
    this.setState({
      ghostNode: (
        <GhostNode
          ref={(ref) => (this.ghostNodeRef = ref)}
          id={id}
          initialPosition={[target.pos[0] * this.state.scale.x, target.pos[1] * this.state.scale.y]}
          initialOffset={[
            evt.clientX - target.pos[0] * this.state.scale.x,
            evt.clientY - target.pos[1] * this.state.scale.y
          ]}
          size={[target.size[0] * this.state.scale.x, target.size[1] * this.state.scale.y]}
          scale={this.state.scale}
        />
      )
    });
  };

  handleMouseUp = (evt: MouseEvent) => {
    if (this.state.ghostNode && this.ghostNodeRef) {
      const gridPos = this.ghostNodeRef.gridPos;
      const id = this.ghostNodeRef.id;
      setTimeout(() => {
        const targetIndex = this.props.nodes.findIndex((node) => node.id === id);
        if (
          this.props.nodes[targetIndex].pos[0] === gridPos[0] &&
          this.props.nodes[targetIndex].pos[1] === gridPos[1]
        )
          return;

        const data = copyNodeData(this.props.nodes);
        data[targetIndex].pos = gridPos;
        this.props.onNodesUpdate(data);
      }, 0);

      this.ghostNodeRef = null;
      this.setState({ ghostNode: null });
    }
  };
}
