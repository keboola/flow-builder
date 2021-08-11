import React from "react";
import { v2 } from "./util";
import { filter } from "./Io";
import { GraphContext } from "./context";

export const Group = (props: Group.Props) => {
  if (!props.children) return null;

  const { inputs, outputs, remainder: children } = filter(props.children);

  return (
    <GraphContext.Provider value={{ parent: "Group" }}>
      <div
        data-type="group"
        data-name={props.name}
        className={"flow-builder--group"}
        style={v2.from(props.position).css()}
      >
        <div className="flow-builder--content">{children}</div>
        <div className="flow-builder--io flow-builder--io-top">
          {inputs.map((name) => (
            <div className="flow-builder--io-port" key={name} data-name={`${props.name}.${name}`} />
          ))}
        </div>
        <div className="flow-builder--io flow-builder--io-bottom">
          {outputs.map((name) => (
            <div className="flow-builder--io-port" key={name} data-name={`${props.name}.${name}`} />
          ))}
        </div>
      </div>
    </GraphContext.Provider>
  );
};
export namespace Group {
  export type Props = {
    name: string;
    position: [number, number];
    children?: React.ReactElement | React.ReactElement[];
  };
}
