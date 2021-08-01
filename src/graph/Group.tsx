import React from "react";
import { validateChildren, classes, pos } from "./util";

export const Group = (props: Group.Props) => {
  if (!props.children) return null;
  validateChildren("Group", props.children, ["Node"], "inclusive");

  return (
    <div
      data-type="group"
      data-id={props.id}
      className={classes({
        "flow-graph--group": true,
        "align-self-horizontal": !!props["align-x"],
        "align-self-vertical": !!props["align-y"]
      })}
      style={pos(props.position)}
    >
      <div className="flow-graph--content">
        {props.children}
      </div>
      <div className="flow-graph--io input">
        {props.inputs && props.inputs.map(name => <div key={name} data-id={`${props.id}.${name}`} />)}
      </div>
      <div className="flow-graph--io output">
        {props.outputs && props.outputs.map(name => <div key={name} data-id={`${props.id}.${name}`} />)}
      </div>
    </div>
  );
};
export namespace Group {
  export type Props = {
    id: string,
    position: [number, number],
    "align-x"?: boolean,
    "align-y"?: boolean,
    inputs?: string[],
    outputs?: string[],
    children?: React.ReactElement | React.ReactElement[]
  }
}