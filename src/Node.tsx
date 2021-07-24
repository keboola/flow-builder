import React from "react";
import { bounds, nodeId } from "./util";

type Props = {
  id: string;
  position: [number, number];
  hasInput?: boolean;
  canOutput?: boolean;
  ghost?: boolean;
  selected?: boolean;
  children?: React.ReactNode,
};
const Node = React.forwardRef((
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const style: React.CSSProperties = {
    left: `${props.position[0]}px`,
    top: `${props.position[1]}px`
  };

  const nodeClassName = ["graph-node"];
  const outlineClassName = ["outline"];
  if (props.ghost) {
    nodeClassName.push("ghost");
    // Ghost node does not have any contents
    // its width/height must be set manually
    const originRect = bounds(nodeId(props.id, false, "container"))!;
    style.width = `${originRect.width}px`;
    style.height = `${originRect.height}px`;
  }
  if (props.selected) {
    nodeClassName.push("selected");
    outlineClassName.push("selected");
  }

  return (
    <div
      ref={ref}
      id={nodeId(props.id, !!props.ghost, "container")}
      className={nodeClassName.join(" ")}
      style={style}
    >
      <div className="graph-node-content">
        {props.children}
      </div>
      {props.hasInput && !props.ghost && (
        <div className="io-container">
          <div id={nodeId(props.id, false, "input")} />
        </div>
      )}
      {props.canOutput !== false && !props.ghost && (
        <div className="io-container bottom">
          <div id={nodeId(props.id, false, "output")} />
        </div>
      )}
      <div className={outlineClassName.join(" ")} />
    </div>
  );
});
export default Node;
