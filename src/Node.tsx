import React, { useCallback, useContext, useState, useEffect } from "react";
import { classes, v2, Vector2 } from "./util";
import { filter } from "./Io";
import { GraphContext, useContainerContext } from "./context";

export const Node: React.FC<Node.Props> = (props: Node.Props) => {
  if (!props.children) return null;

  const context = useContext(GraphContext);
  const { inputs, outputs, remainder: children } = filter(props.children);
  if (context.parent === "Group" && (inputs.length > 0 || outputs.length > 0)) {
    console.warn("flow-builder: Inputs/Outputs on Nodes within Groups are ignored");
  }
  const container = useContainerContext();
  // TODO: coordinates in graph space

  // not using setState here intentionally - updating this state should not trigger re-rendering
  const [dragState] = useState<{ start: Vector2 | null; current: Vector2 | null }>({
    start: null,
    current: null
  });
  const onMouseDown = useCallback((evt: React.MouseEvent) => {
    dragState.start = v2(evt.clientX, evt.clientY);
  }, []);
  const onMouseMove = useCallback((evt: MouseEvent) => {
    if (!dragState.start) return;
    if (dragState.current) {
      // drag move
      dragState.current = v2(evt.clientX, evt.clientY);
      props.onDragMove?.([evt.clientX, evt.clientY]);
    } else if (dragState.start.dist(v2(evt.clientX, evt.clientY)) > 10) {
      // drag start
      dragState.current = v2(evt.clientX, evt.clientY);
      props.onDragStart?.([evt.clientX, evt.clientY]);
    }
  }, []);
  const onMouseUp = useCallback((evt: MouseEvent) => {
    dragState.start = null;
    if (!dragState.current) return;
    // drag end
    dragState.current = null;
    props.onDragEnd?.([evt.clientX, evt.clientY]);
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      data-type="node"
      data-name={props.name}
      className={classes("flow-builder--node", [props.className as string, !!props.className])}
      style={{ ...props.style, ...(props.position ? v2.from(props.position).css() : {}) }}
      onMouseDown={onMouseDown}
    >
      <div className="flow-builder--content">{children}</div>
      <div className="flow-builder--io flow-builder--io-top">
        {context.parent !== "Group" &&
          inputs.map(({ name, children, style }) => (
            <div
              className="flow-builder--io-port"
              key={name}
              data-name={`${props.name}.${name}`}
              style={style}
            >
              {children}
            </div>
          ))}
      </div>
      <div className="flow-builder--io flow-builder--io-bottom">
        {context.parent !== "Group" &&
          outputs.map(({ name, children, style }) => (
            <div
              className="flow-builder--io-port"
              key={name}
              data-name={`${props.name}.${name}`}
              style={style}
            >
              {children}
            </div>
          ))}
      </div>
    </div>
  );
};
export namespace Node {
  export type Props = {
    name: string;
    position?: [number, number];
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    onDragStart?: (position: [number, number]) => void;
    onDragMove?: (position: [number, number]) => void;
    onDragEnd?: (position: [number, number]) => void;
  };
}
