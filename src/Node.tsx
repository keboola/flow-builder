import React, { useContext } from "react";
import { classes, v2 } from "./util";
import { filter } from "./Io";
import { GraphContext } from "./context";
import { useDrag } from "./drag";

export const Node: React.FC<Node.Props> = (props: Node.Props) => {
  if (!props.children) return null;

  const context = useContext(GraphContext);
  const { inputs, outputs, remainder: children } = filter(props.children);
  if (context.parent === "Group" && (inputs.length > 0 || outputs.length > 0)) {
    console.warn("flow-builder: Inputs/Outputs on Nodes within Groups are ignored");
  }

  const [dragTarget, onMouseDown] = useDrag(props.draggable ? props : { onSelect: props.onSelect });

  return (
    <div
      ref={dragTarget}
      data-type="node"
      data-name={props.name}
      className={classes("flow-builder--node", [props.className as string, !!props.className])}
      style={{ ...props.style, ...(props.position ? v2.from(props.position).css() : {}) }}
      onMouseDown={onMouseDown}
      tabIndex={props.onSelect && 0}
      onKeyDown={(event) => event.key === "Enter" && props.onSelect?.()}
      role={props.onSelect && "button"}
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
    draggable?: boolean;
    onDragStart?: (position: [number, number]) => void;
    onDragMove?: (position: [number, number]) => void;
    onDragEnd?: (position: [number, number]) => void;
    onSelect?: () => void;
  };
}
