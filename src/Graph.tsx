import React from "react";
import "./Graph.css";
import Node from "./Node";
import Edge from "./Edge";
import * as util from "./util";
import { GraphData, GroupNode, NodeData, SimpleNode } from "./data";

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
  selectedNodeId?: string;
};
export default class Graph extends React.Component<Props, State> {
  private ghostNode: {
    el: JSX.Element | null,
    ref: HTMLDivElement | null,
    initialOffset: [number, number],
    gridPos: [number, number],
    group: string | null
  };
  private ghostEdge: {
    el: JSX.Element | null,
    ref: SVGPathElement | null,
    start: [number, number],
    from: string,
    to: string,
    previousTo: string,
  };
  private drag: {
    node: HTMLElement | null,
    type: util.NodeKind,
    start: [number, number],
  };
  private dragging: boolean;
  private recalculatePathsNextUpdate: boolean;

  constructor(props: typeof Graph.prototype.props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      cellSize: props.cellSize ?? 25,
    };

    this.ghostNode = {
      el: null,
      ref: null,
      initialOffset: [0, 0],
      gridPos: [0, 0],
      group: null
    };
    this.ghostEdge = {
      el: null,
      ref: null,
      start: [0, 0],
      from: "",
      to: "",
      previousTo: "",
    };
    this.drag = {
      node: null,
      type: "node",
      start: [0, 0]
    };
    this.dragging = false;
    this.recalculatePathsNextUpdate = false;

    // TODO: maybe also validate that each node id is unique
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

    // this is to force re-calculate edge paths after mounting,
    // because their positions are based on the node positions/sizes,
    // which aren't available during the initial render
    this.forceUpdate();
  }

  componentDidUpdate() {
    // same reasoning as in `componentDidMount`
    if (this.recalculatePathsNextUpdate) {
      this.forceUpdate();
      this.recalculatePathsNextUpdate = false;
    }
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
      const fromBounds = util.bounds(util.Id.node(from.id, false), this.props.id);
      const toBounds = util.bounds(util.Id.node(to.id, false), this.props.id);
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
        {...this.props.data.nodes.map(node => (
          <Node
            id={node.id}
            containerId={this.props.id}
            pos={node.pos}
            content={node.type === "node" ? node.content : undefined}
            nested={node.type === "group" ? node.nodes : undefined}
            key={node.id}
            cellSize={this.state.cellSize}
            hasInput={
              references.has(node.id) ||
              this.ghostEdge.to === node.id
            }
            selected={this.state.selectedNodeId}
          />
        ))}
        {this.ghostNode.el}
      </div>
    );
  }

  private handleMouseDown = (evt: MouseEvent) => {
    const targetEl = evt.target as Element;
    if (!targetEl) return;

    const info = util.Id.parse(targetEl.id);
    if (!info) return;

    const node = document.getElementById(util.Id.node(info.id, false));
    if (!node) return;
    evt.stopPropagation();

    const containerBounds = util.bounds(this.props.id, this.props.id)!;

    this.drag.node = node;
    this.drag.type = info.type;
    this.drag.start[0] = evt.clientX + containerBounds.left;
    this.drag.start[1] = evt.clientY + containerBounds.top;
  };

  private handleMouseMove = (evt: MouseEvent) => {
    const mousePos: [number, number] = [evt.clientX, evt.clientY];
    if (this.drag.node) {
      if (
        !this.dragging &&
        util.distance(mousePos, this.drag.start) > 2
      ) {
        const targetNode = this.drag.node;
        const targetNodeRect = util.bounds(targetNode.id, this.props.id)!;
        const targetNodeId = util.Id.parse(targetNode.id)!.id;
        this.dragging = true;
        if (this.drag.type === "node") {
          this.setState({ selectedNodeId: targetNode.id });
          this.ghostNode.gridPos = [
            targetNodeRect.left,
            targetNodeRect.top
          ];
          this.ghostNode.initialOffset = [
            this.drag.start[0] - targetNodeRect.left,
            this.drag.start[1] - targetNodeRect.top
          ];
          this.ghostNode.el = (
            <Node
              containerId={this.props.id}
              id={targetNodeId}
              pos={[targetNodeRect.left, targetNodeRect.top]}
              nested={util.getNodeType(targetNode) === "group" ? [] : undefined}
              ghost
              containerRef={v => this.ghostNode.ref = v}
              key={targetNode.id}
              cellSize={this.state.cellSize}
            />
          );
        } else if (this.drag.type === "output") {
          this.ghostEdge.start = [
            targetNodeRect.left + targetNodeRect.width / 2,
            targetNodeRect.top + targetNodeRect.height
          ];
          this.ghostEdge.from = targetNodeId;
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
          const containerBounds = util.bounds(this.props.id)!;
          // TODO: clamping should be based on the bounds of the node itself
          this.ghostNode.gridPos[0] = util.toGrid(util.clamp(
            mousePos[0] - this.ghostNode.initialOffset[0],
            containerBounds.x + this.state.cellSize,
            containerBounds.x + containerBounds.width - this.state.cellSize * 2
          ), this.state.cellSize);
          this.ghostNode.gridPos[1] = util.toGrid(util.clamp(
            mousePos[1] - this.ghostNode.initialOffset[1],
            containerBounds.y + this.state.cellSize,
            containerBounds.y + containerBounds.height - this.state.cellSize * 2
          ), this.state.cellSize);
          this.ghostNode.ref.style.left = `${this.ghostNode.gridPos[0] * this.state.cellSize}px`;
          this.ghostNode.ref.style.top = `${this.ghostNode.gridPos[1] * this.state.cellSize}px`;
          const intersecting = this.props.data.nodes.find(node => {
            const nodeBounds = util.bounds(util.Id.node(node.id, false))!;
            return util.intersects.aabb(
              mousePos,
              {
                pos: [nodeBounds.left, nodeBounds.top],
                size: [nodeBounds.width, nodeBounds.height]
              }
            );
          });
          if (intersecting && util.Id.node(intersecting.id) !== this.drag.node.id) {
            console.log("intersecting", intersecting.id);
            this.ghostNode.group = intersecting.id;
          } else {
            this.ghostNode.group = null;
          }
        } else if (this.ghostEdge.ref) {
          this.ghostEdge.previousTo = this.ghostEdge.to;
          const intersecting = this.props.data.nodes.find(node => {
            const nodeBounds = util.bounds(util.Id.node(node.id, false))!;
            return util.intersects.aabb(
              mousePos,
              {
                pos: [nodeBounds.left, nodeBounds.top],
                size: [nodeBounds.width, nodeBounds.height]
              }
            );
          });

          let path: string;
          if (intersecting) {
            this.ghostEdge.to = intersecting.id;
            const toElementRect = util.bounds(util.Id.node(this.ghostEdge.to), this.props.id)!;
            path = util.calculatePath(this.ghostEdge.start, [
              toElementRect.left + toElementRect.width / 2,
              toElementRect.top
            ]);
          } else {
            this.ghostEdge.to = "";
            path = util.calculatePath(this.ghostEdge.start, util.toContainerRelativePos(this.props.id, mousePos));
          }
          this.ghostEdge.ref.setAttribute("d", path);
          if (this.ghostEdge.to !== this.ghostEdge.previousTo) {
            this.forceUpdate();
          }
        }
      }
    }
  }

  private handleMouseUp = (evt: MouseEvent) => {
    const targetNode = this.drag.node;
    if (this.dragging && targetNode) {
      if (this.ghostNode.ref) {
        evt.stopPropagation();

        const gridPos = this.ghostNode.gridPos;
        const info = util.Id.parse(this.ghostNode.ref.id)!;
        const group = this.ghostNode.group;
        this.updateNodes((data) => {
          if (util.isNodeNested(targetNode)) {
            const parentId = util.getParentId(targetNode)!;
            const parentNode = data.nodes.find(node => node.id === parentId) as GroupNode;
            const removed = util.remove(parentNode.nodes, node => node.id === info.id)!;
            data.nodes.push({
              ...removed,
              type: "node",
              pos: [gridPos[0], gridPos[1]],
            });
            if (parentNode.nodes.length === 1) {
              util.remove(data.nodes, node => node.id === parentNode.id);
              const remaining = parentNode.nodes[0];
              data.edges.forEach(edge => {
                if (edge.from === parentNode.id) edge.from = remaining.id;
                else if (edge.to === parentNode.id) edge.to = remaining.id;
              });
              data.nodes.push({
                ...remaining,
                type: "node",
                pos: [parentNode.pos[0], parentNode.pos[1]],
              });
            } else {
              parentNode.id = parentNode.nodes.map(node => node.id).join("+");
            }
          } else {
            if (group && util.getNodeType(targetNode) !== "group") {
              const removed = util.remove(data.nodes, node => node.id === info.id)! as SimpleNode;
              data.edges = data.edges.filter(edge => edge.from !== info.id && edge.to !== info.id);
              const target = data.nodes.find(node => node.id === group)!;
              if (target.type === "group") {
                target.nodes.push({
                  id: removed.id,
                  content: removed.content
                });
                target.id = target.nodes.map(node => node.id).join("+");
              } else {
                util.remove(data.nodes, node => node.id === target.id);
                data.edges = data.edges.filter(edge => edge.from !== target.id && edge.to !== target.id);
                data.nodes.push({
                  id: `${removed.id}+${target.id}`,
                  type: "group",
                  pos: [target.pos[0], target.pos[1]],
                  nodes: [
                    { id: removed.id, content: removed.content },
                    { id: target.id, content: target.content }
                  ]
                })
              }
            } else {
              const nodeIndex = data.nodes.findIndex(node => node.id === info.id);
              if (
                this.props.data.nodes[nodeIndex].pos[0] === gridPos[0] &&
                this.props.data.nodes[nodeIndex].pos[1] === gridPos[1]
              ) {
                return false;
              }
              data.nodes[nodeIndex].pos = [gridPos[0], gridPos[1]];
            }
          }
        });

        this.ghostNode.el = null;
        this.ghostNode.ref = null;
      }
      else if (this.ghostEdge.ref) {
        evt.stopPropagation();

        const fromId = this.ghostEdge.from;
        const toId = this.ghostEdge.to;
        this.updateNodes((data) => {
          const from = data.nodes.find(node => node.id === fromId);
          const to = data.nodes.find(node => node.id === toId);
          if (
            !from || !to || (
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
      this.setState({
        selectedNodeId: this.drag.node
          ? util.Id.parse(this.drag.node.id)!.id
          : undefined
      });
    }

    this.dragging = false;
    this.drag.node = null;
  };

  private updateNodes(callback: (data: GraphData) => void | false) {
    setTimeout(() => {
      const data = GraphData.copy(this.props.data);
      if (callback(data) === false) return;
      this.recalculatePathsNextUpdate = true;
      this.props.onUpdate(data);
    });
  }
}
