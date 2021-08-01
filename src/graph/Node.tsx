import React from "react";
import { validateChildren, classes, pos } from "./util";

export const Node: React.FC<Node.Props> = (props: Node.Props) => {
  if (!props.children) return null;
  validateChildren("Node", props.children, ["Graph", "Group", "Node"], "exclusive");

  return (
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
export namespace Node {
  export type Props = {
    id: string,
    position?: [number, number],
    "align-x"?: boolean,
    "align-y"?: boolean,
    inputs?: string[],
    outputs?: string[],
    children?: React.ReactElement | React.ReactElement[]
  };
}
