import React from "react";
import { classes, removeAll, is, pos, validateChildren } from "./util";
import { GraphContext } from "./context";

export const Group = (props: Group.Props) => {
  if (!props.children) return null;

  // Ensure `Group` is a child of `Graph`
  const parent = React.useContext(GraphContext);
  if (parent !== "Graph") {
    throw new Error(`Group '${props.id}' must be a direct child of a Graph`);
  }
  // Ensure children of `Group` are all `Node`, "Input", or "Output"
  validateChildren("Group", props.children, ["Node", "Input", "Output"], "inclusive");

  const childArray = React.Children.toArray(props.children);
  const inputs = removeAll(childArray, child => is(child, "Input")).map(child => (child as any).props.id);
  const outputs = removeAll(childArray, child => is(child, "Output")).map(child => (child as any).props.id);

  return (
    <GraphContext.Provider value={"Group"}>
      <div
        data-type="group"
        data-id={props.id}
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
          {inputs.map(name => <div key={name} data-id={`${props.id}.${name}`} />)}
        </div>
        <div className="flow-graph--io output">
          {outputs.map(name => <div key={name} data-id={`${props.id}.${name}`} />)}
        </div>
      </div>
    </GraphContext.Provider>
  );
};
export namespace Group {
  export type Props = {
    id: string,
    position: [number, number],
    "align-x"?: boolean,
    "align-y"?: boolean,
    children?: React.ReactElement | React.ReactElement[]
  }
}