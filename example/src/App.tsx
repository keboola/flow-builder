import React, { useCallback, useRef, useState } from "react";
import "@keboola/flow-builder/Graph.css";
import { Graph, Group, Node, Input, Output } from "@keboola/flow-builder";

const spacing = 100; /* px */

const useForceUpdate = () => {
  const [_, update] = useState({});
  return () => update({});
};

const App = () => {
  // HACK: for some reason, storing `dragging` and `hovering` via `useState`
  // did not reflect updated state in node `onDragEnd` callbacks.
  // Resorting to mutable refs + force update.
  const forceUpdate = useForceUpdate();
  const [data] = useState([
    ["a", "b", "c"],
    ["d", "f", "g"]
  ]);
  const dragging = useRef<{ node: string; pos: [number, number] }>();
  const hovering = useRef<string>();

  let offset = {
    value: 100,
    next() {
      const out = this.value;
      this.value += spacing;
      return out;
    }
  };

  const edges = [];
  for (let i = 0; i < data.length - 1; ++i) {
    edges.push(`${data[i].join("+")}.out->${data[i + 1].join("+")}.in`);
  }

  return (
    <div
      style={{
        position: "relative",
        left: "20px",
        width: "50%",
        height: "50%"
      }}
    >
      Dragging: {dragging.current?.node ?? "none"}{" "}
      {dragging.current?.pos
        ? `(x: ${dragging.current.pos[0]}, y: ${dragging.current.pos[0]})`
        : ""}
      <br />
      Hovering: {hovering.current ?? "none"}
      <style>
        {`
        .content {
          width: 4em;
          height: 3em;
          text-align: center;
          line-height: 3em;
          user-select: none;
        }
        .flow-builder--node {
          border: 1px solid rgb(223, 225, 229);
          border-radius: 8px;
          box-shadow: 2px 2px 2px 1px rgba(245, 245, 245, 100);
        }
        .flow-builder--node.drag {
          border: 1px solid blue;
        }
        .flow-builder--group {
          border: 1px solid rgb(223, 225, 229);
          border-radius: 8px;
          padding: 5px;
        }
        .flow-builder--group .flow-builder--node {
          box-shadow: none;
        }
        .flow-builder--io-port[data-name$="success"] {
          background-color: green;
        }
        `}
      </style>
      <Graph edges={edges} calculatePath={(from, to) => `M ${from.x} ${from.y} L ${to.x} ${to.y}`}>
        {data.map((group) => (
          <Group
            onMouseEnter={() => {
              hovering.current = group.join("+");
              forceUpdate();
            }}
            onMouseLeave={() => {
              hovering.current = undefined;
              forceUpdate();
            }}
            key={group.join("+")}
            name={group.join("+")}
            position={[200, offset.next()]}
          >
            <Input name="in" />
            <Output name="out" />
            {group.map((node) => (
              <Node
                key={node}
                name={node}
                onDragStart={(pos) => {
                  dragging.current = { node, pos };
                  forceUpdate();
                }}
                onDragMove={(pos) => {
                  if (!dragging.current) return;
                  dragging.current.pos = pos;
                  forceUpdate();
                }}
                onDragEnd={() => {
                  if (!hovering.current) return;
                  group.splice(group.indexOf(node), 1);
                  data.find((group) => group.join("+") === hovering.current)!.push(node);
                  dragging.current = undefined;
                  forceUpdate();
                }}
              >
                <div className="content">{dragging.current?.node !== node ? node : ""}</div>
              </Node>
            ))}
            {hovering.current === group.join("+") &&
              dragging.current &&
              !group.includes(dragging.current.node) && (
                <Node name={"preview-ghost"}>
                  <div className="content"></div>
                </Node>
              )}
          </Group>
        ))}
        {dragging.current && (
          <Node name={"drag-ghost"} position={dragging.current.pos}>
            <div className="content">{dragging.current.node}</div>
          </Node>
        )}
      </Graph>
    </div>
  );
};

export default App;
