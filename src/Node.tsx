import React, { useContext } from "react";
import { v2 } from "./util";
import { filter } from "./Io";
import { GraphContext } from "./context";

export const Node: React.FC<Node.Props> = (props: Node.Props) => {
  if (!props.children) return null;

  const context = useContext(GraphContext);
  const { inputs, outputs, remainder: children } = filter(props.children);
  if (context.parent === "Group" && (inputs.length > 0 || outputs.length > 0)) {
    console.warn("flow-builder: Inputs/Outputs on Nodes within Groups are ignored");
  }

  return (
    <div
      data-type="node"
      data-name={props.name}
      className={"flow-builder--node"}
      style={{ ...props.style, ...(props.position ? v2.from(props.position).css() : {}) }}
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
    children?: React.ReactElement | React.ReactElement[];
  };
}
