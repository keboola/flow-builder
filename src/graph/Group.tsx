import React from "react";
import { classes, pos, validateChildren } from "./util";
import { GraphContext } from "./context";
import { IO } from "./Io";

export const Group = (props: Group.Props) => {
  if (!props.children) return null;

  // Ensure `Group` is a child of `Graph`
  const parent = React.useContext(GraphContext);
  if (parent !== "Graph") {
    throw new Error(`Group '${props.name}' must be a direct child of a Graph`);
  }
  // Ensure children of `Group` are all `Node`, "Input", or "Output"
  validateChildren("Group", props.children, ["Node", "Input", "Output"], "inclusive");

  const { inputs, outputs, remainder: children } = IO.filter(props.children);

  return (
    <GraphContext.Provider value={"Group"}>
      <div
        data-type="group"
        data-name={props.name}
        className={classes({
          "flow-graph--group": true,
          "flow-graph--align-x": !!props["align-x"],
          "flow-graph--align-y": !!props["align-y"]
        })}
        style={pos(props.position)}
      >
        <div className="flow-graph--content">
          {children}
        </div>
        <div className="flow-graph--io flow-graph--io-top">
          {inputs.map(name => (
            <div className="flow-graph--io-port" key={name} data-name={`${props.name}.${name}`} />
          ))}
        </div>
        <div className="flow-graph--io flow-graph--io-bottom">
          {outputs.map(name => (
            <div className="flow-graph--io-port" key={name} data-name={`${props.name}.${name}`} />
          ))}
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