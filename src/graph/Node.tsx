import React from "react";
import { classes, pos, validateChildren, is, removeAll } from "./util";
import { GraphContext } from "./context";
import { IO } from "./Io";

export const Node: React.FC<Node.Props> = (props: Node.Props) => {
  if (!props.children) return null;

  // Ensure `Node` is a child of `Graph` or `Group`
  const parent = React.useContext(GraphContext);
  if (!parent || !["Graph", "Group"].includes(parent)) {
    throw new Error(`Node '${props.name}' must be a direct child of a Graph or a Group`);
  }
  // Ensure children of `Node` are never `Graph`, `Group`, or `Node`
  validateChildren("Node", props.children, ["Graph", "Group", "Node"], "exclusive");

  const { inputs, outputs, remainder: children } = IO.filter(props.children);

  return (
    <GraphContext.Provider value={"Node"}>
      <div
        data-type="node"
        data-name={props.name}
        className={classes({
          "flow-graph--node": true,
          "flow-graph--align-x": !!props["align-x"],
          "flow-graph--align-y": !!props["align-y"]
        })}
        style={props.position ? pos(props.position) : {}}
      >
        <div className="flow-graph--content">
          {children}
        </div>
        <div className="flow-graph--io flow-graph--io-top">
          {parent !== "Group" && inputs.map(name => (
            <div
              className="flow-graph--io-port"
              key={name}
              data-name={`${props.name}.${name}`}
            />
          ))}
        </div>
        <div className="flow-graph--io flow-graph--io-bottom">
          {parent !== "Group" && outputs.map(name => (
            <div
              className="flow-graph--io-port"
              key={name}
              data-name={`${props.name}.${name}`}
            />
          ))}
        </div>
      </div>
    </GraphContext.Provider>
  );
};
export namespace Node {
  export type Props = {
    name: string,
    position?: [number, number],
    "align-x"?: boolean,
    "align-y"?: boolean,
    children?: React.ReactElement | React.ReactElement[]
  };
}
