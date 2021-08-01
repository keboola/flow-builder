import React from "react";
import { classes, removeAll, is, pos, validateChildren } from "./util";
import { GraphContext } from "./context";
import type { IO } from "./Io";

export const Group = (props: Group.Props) => {
  if (!props.children) return null;

  // Ensure `Group` is a child of `Graph`
  const parent = React.useContext(GraphContext);
  if (parent !== "Graph") {
    throw new Error(`Group '${props.name}' must be a direct child of a Graph`);
  }
  // Ensure children of `Group` are all `Node`, "Input", or "Output"
  validateChildren("Group", props.children, ["Node", "Input", "Output"], "inclusive");

  const childArray = React.Children.toArray(props.children);
  const inputs = removeAll(childArray, child => is(child, "Input"))
    .map(child => (child as React.ReactElement<IO.Props>).props.name);
  const outputs = removeAll(childArray, child => is(child, "Output"))
    .map(child => (child as React.ReactElement<IO.Props>).props.name);

  return (
    <GraphContext.Provider value={"Group"}>
      <div
        data-type="group"
        data-id={props.name}
        className={classes({
          "flow-graph--group": true,
          "flow-graph--align-x": !!props["align-x"],
          "flow-graph--align-y": !!props["align-y"]
        })}
        style={pos(props.position)}
      >
        <div className="flow-graph--content">
          {childArray}
        </div>
        <div className="flow-graph--io input">
          {inputs.map(name => <div key={name} data-id={`${props.name}.${name}`} />)}
        </div>
        <div className="flow-graph--io output">
          {outputs.map(name => <div key={name} data-id={`${props.name}.${name}`} />)}
        </div>
      </div>
    </GraphContext.Provider>
  );
};
export namespace Group {
  export type Props = {
    name: string,
    position: [number, number],
    "align-x"?: boolean,
    "align-y"?: boolean,
    children?: React.ReactElement | React.ReactElement[]
  }
}