import React from "react";
import { classes, pos, validateChildren, is, removeAll } from "./util";
import { GraphContext } from "./context";

export const Node: React.FC<Node.Props> = (props: Node.Props) => {
  if (!props.children) return null;

  // Ensure `Node` is a child of `Graph` or `Group`
  const parent = React.useContext(GraphContext);
  if (!parent || !["Graph", "Group"].includes(parent)) {
    throw new Error(`Node '${props.id}' must be a direct child of a Graph or a Group`);
  }
  // Ensure children of `Node` are never `Graph`, `Group`, or `Node`
  validateChildren("Node", props.children, ["Graph", "Group", "Node"], "exclusive");

  const childArray = React.Children.toArray(props.children);
  const inputs = removeAll(childArray, child => is(child, "Input")).map(child => (child as any).props.id);
  const outputs = removeAll(childArray, child => is(child, "Output")).map(child => (child as any).props.id);

  return (
    <GraphContext.Provider value={"Node"}>
      <div
        data-type="node"
        data-id={props.id}
        className={classes({
          "flow-graph--node": true,
          "align-self-horizontal": !!props["align-x"],
          "align-self-vertical": !!props["align-y"]
        })}
        style={props.position ? pos(props.position) : {}}
      >
        <div className="flow-graph--content">
          {childArray}
        </div>
        <div className="flow-graph--io input">
          {parent !== "Group" && inputs.map(name => <div key={name} data-id={`${props.id}.${name}`} />)}
        </div>
        <div className="flow-graph--io output">
          {parent !== "Group" && outputs.map(name => <div key={name} data-id={`${props.id}.${name}`} />)}
        </div>
      </div>
    </GraphContext.Provider>
  );
};
export namespace Node {
  export type Props = {
    id: string,
    position?: [number, number],
    "align-x"?: boolean,
    "align-y"?: boolean,
    children?: React.ReactElement | React.ReactElement[]
  };
}
