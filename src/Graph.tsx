import React from "react";
import "./Graph.css";
import Node from "./Node";
import Edge from "./Edge";
import { clamp, distance, calculatePath, intersects, nodeId, NodePart, bounds, snap, toGrid } from "./util";
import { GraphData, NodeData } from "./data";

type Props = {
  id: string;
  data: GraphData;
  onUpdate: (data: GraphData) => void;
  /** Pixels per cell */
  cellSize?: number;
};
type State = {
  width: number;
  height: number;
  cellSize: number;
  selectedNodeId: string | null;
};
export default class Graph extends React.Component<Props, State> {
  private ghostNode: {
    el: JSX.Element | null,
    ref: HTMLDivElement | null,
    initialOffset: [number, number],
    gridPos: [number, number],
  };
  private ghostEdge: {
    el: JSX.Element | null,
    ref: SVGPathElement | null,
    start: [number, number],
    from: number,
    to: number,
    previousTo: number,
  };
  private drag: {
    node: NodeData | null,
    nodeIndex: number,
    part: NodePart,
    start: [number, number],
  };
  private dragging: boolean;

  constructor(props: typeof Graph.prototype.props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      cellSize: props.cellSize ?? 25,
      selectedNodeId: null,
    };

    this.ghostNode = {
      el: null,
      ref: null,
      initialOffset: [0, 0],
      gridPos: [0, 0]
    };
    this.ghostEdge = {
      el: null,
      ref: null,
      start: [0, 0],
      from: -1,
      to: -1,
      previousTo: -1,
    };
    this.drag = {
      node: null,
      nodeIndex: -1,
      part: "container",
      start: [0, 0]
    };
    this.dragging = false;

    // edge validation
    for (const edges of this.props.data.edges) {
      let from: NodeData | null = null;
      let to: NodeData | null = null;
      for (const node of this.props.data.nodes) {
        if (node.id === edges.from) from = node;
        if (node.id === edges.to) to = node;
        if (from && to) break;
      }
      if (!from || !to) {
        console.warn(`Invalid edge: (${edges.from})->(${edges.to}), node '${from ? edges.to : edges.from}' does not exist`);
        continue;
      }
    }
  }

  componentDidMount() {
    window.addEventListener("mousedown", this.handleMouseDown, false);
    window.addEventListener("mousemove", this.handleMouseMove, false);
    window.addEventListener("mouseup", this.handleMouseUp, false);

    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleMouseDown, false);
    window.removeEventListener("mousemove", this.handleMouseMove, false);
    window.removeEventListener("mouseup", this.handleMouseUp, false);
  }

  render() {
    const references = new Set<string>();
    const paths: JSX.Element[] = [];
    for (const edges of this.props.data.edges) {
      references.add(edges.to);
      let from: NodeData | null = null;
      let to: NodeData | null = null;
      for (const node of this.props.data.nodes) {
        if (node.id === edges.from) from = node;
        if (node.id === edges.to) to = node;
        if (from && to) break;
      }
      if (!from || !to) continue;
      const fromBounds = bounds(nodeId(from.id, false, "container"));
      const toBounds = bounds(nodeId(to.id, false, "container"));
      if (!fromBounds || !toBounds) continue;
      const start = [
        from.pos[0] * this.state.cellSize + fromBounds.width / 2,
        from.pos[1] * this.state.cellSize + fromBounds.height
      ];
      const end = [
        to.pos[0] * this.state.cellSize + toBounds.width / 2,
        to.pos[1] * this.state.cellSize
      ];
      paths.push(
        <Edge
          key={from.id + to.id}
          start={start}
          end={end}
        />
      );
    }

    return (
      <div id={this.props.id} className="graph-container">
        <svg>
          {...paths}
          {this.ghostEdge.el}
        </svg>
        {...this.props.data.nodes.map((node, index) => (
          <Node
            key={node.id}
            id={node.id}
            position={[node.pos[0] * this.state.cellSize, node.pos[1] * this.state.cellSize]}
            hasInput={references.has(node.id) || this.ghostEdge.to === index}
            selected={node.id === this.state.selectedNodeId}
          >
            {node.content}
          </Node>
        ))}
        {this.ghostNode.el}
      </div>
    );
  }

  private handleMouseDown = (evt: MouseEvent) => {
    const targetEl = evt.target as Element;
    if (!targetEl) return;

    const info = nodeId.parse(targetEl.id);
    if (!info) return;

    const nodeIndex = this.props.data.nodes.findIndex((node) => node.id === info.id);
    const node = this.props.data.nodes[nodeIndex];
    if (!node) return;

    evt.stopPropagation();

    this.drag.node = node;
    this.drag.nodeIndex = nodeIndex;
    this.drag.part = info.part;
    this.drag.start[0] = evt.clientX;
    this.drag.start[1] = evt.clientY;
  };

  private handleMouseMove = (evt: MouseEvent) => {
    if (
      !this.dragging &&
      this.drag.node &&
      distance([evt.clientX, evt.clientY], this.drag.start) > 2
    ) {
      this.dragging = true;
      if (this.drag.part === "container") {
        this.setState({ selectedNodeId: this.drag.node.id });
        this.ghostNode.gridPos = [
          this.drag.node.pos[0],
          this.drag.node.pos[1]
        ];
        this.ghostNode.initialOffset = [
          this.drag.start[0] - this.drag.node.pos[0] * this.state.cellSize,
          this.drag.start[1] - this.drag.node.pos[1] * this.state.cellSize
        ];
        this.ghostNode.el = (
          <Node
            id={this.drag.node.id}
            ref={v => this.ghostNode.ref = v}
            ghost
            position={[
              this.drag.node.pos[0] * this.state.cellSize,
              this.drag.node.pos[1] * this.state.cellSize
            ]}
          />
        );
      } else if (this.drag.part === "output") {
        const nodeBounds = bounds(nodeId(this.drag.node.id, false, "container"))!;
        this.ghostEdge.start = [
          this.drag.node.pos[0] * this.state.cellSize + nodeBounds.width / 2,
          this.drag.node.pos[1] * this.state.cellSize + nodeBounds.height
        ];
        this.ghostEdge.from = this.drag.nodeIndex;
        this.ghostEdge.el = (
          <Edge
            ref={v => this.ghostEdge.ref = v}
            start={this.ghostEdge.start}
            end={[
              this.drag.start[0],
              this.drag.start[1]
            ]}
          />
        );
      }

      this.forceUpdate();
    } else {
      if (this.ghostNode.ref) {
        const containerBounds = bounds(this.props.id)!;
        this.ghostNode.gridPos[0] = toGrid(clamp(
          evt.clientX - this.ghostNode.initialOffset[0],
          containerBounds.x + this.state.cellSize,
          containerBounds.x + containerBounds.width - this.state.cellSize * 2
        ), this.state.cellSize);
        this.ghostNode.gridPos[1] = toGrid(clamp(
          evt.clientY - this.ghostNode.initialOffset[1],
          containerBounds.y + this.state.cellSize,
          containerBounds.y + containerBounds.height - this.state.cellSize * 2
        ), this.state.cellSize);
        this.ghostNode.ref.style.left = `${this.ghostNode.gridPos[0] * this.state.cellSize}px`;
        this.ghostNode.ref.style.top = `${this.ghostNode.gridPos[1] * this.state.cellSize}px`;
      } else if (this.ghostEdge.ref) {
        const mouse: [number, number] = [evt.clientX, evt.clientY];
        this.ghostEdge.previousTo = this.ghostEdge.to;
        this.ghostEdge.to = this.props.data.nodes.findIndex(node => {
          const nodeBounds = bounds(nodeId(node.id, false, "container"))!;
          return intersects.aabb(
            mouse,
            {
              pos: [node.pos[0] * this.state.cellSize, node.pos[1] * this.state.cellSize],
              size: [nodeBounds.width, nodeBounds.height]
            }
          );
        });

        const toNode = this.props.data.nodes[this.ghostEdge.to];
        const path = this.ghostEdge.to === -1
          ? calculatePath(this.ghostEdge.start, mouse)
          : calculatePath(this.ghostEdge.start, [
            toNode.pos[0] * this.state.cellSize + bounds(nodeId(toNode.id, false, "container"))!.width / 2,
            toNode.pos[1] * this.state.cellSize
          ]);
        this.ghostEdge.ref.setAttribute("d", path);
        if (this.ghostEdge.to !== this.ghostEdge.previousTo) {
          this.forceUpdate();
        }
      } else {

      }
    }
  }

  private handleMouseUp = (evt: MouseEvent) => {
    if (this.dragging) {
      if (this.ghostNode.ref) {
        evt.stopPropagation();

        const gridPos = this.ghostNode.gridPos;
        const info = nodeId.parse(this.ghostNode.ref.id)!;
        this.updateNodes((data) => {
          const nodeIndex = data.nodes.findIndex(node => node.id === info.id);
          if (
            this.props.data.nodes[nodeIndex].pos[0] === gridPos[0] &&
            this.props.data.nodes[nodeIndex].pos[1] === gridPos[1]
          ) {
            return false;
          }
          data.nodes[nodeIndex].pos = [gridPos[0], gridPos[1]];
        });

        this.ghostNode.el = null;
        this.ghostNode.ref = null;
      }
      else if (this.ghostEdge.ref) {
        evt.stopPropagation();

        const fromIdx = this.ghostEdge.from;
        const toIdx = this.ghostEdge.to;
        this.updateNodes((data) => {
          const from = data.nodes[fromIdx];
          const to = data.nodes[toIdx];
          if (
            !to || (
              data.edges.length !== 0 &&
              data.edges.find(edge => edge.from === from.id && edge.to === to.id)
            )
          ) {
            return false;
          }

          data.edges.push({ from: from.id, to: to.id });
        });

        this.ghostEdge.el = null;
        this.ghostEdge.ref = null;
      }
      this.forceUpdate();
    } else {
      this.setState({ selectedNodeId: this.drag.node?.id ?? null });
    }

    this.dragging = false;
    this.drag.node = null;
    this.drag.nodeIndex = -1;
    this.drag.start[0] = 0;
    this.drag.start[1] = 0;
  };

  private updateNodes(callback: (data: GraphData) => void | false) {
    setTimeout(() => {
      const data = GraphData.copy(this.props.data);
      if (callback(data) === false) return;
      this.props.onUpdate(data);
    });
  }
}
