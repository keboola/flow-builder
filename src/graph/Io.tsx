import React from "react";
import { GraphContext } from "./context";
import { is, removeAll } from "./util";


export const Input = ({ name: id }: IO.Props) => {
  const parent = React.useContext(GraphContext);
  if (!parent || !["Group", "Node"].includes(parent)) {
    throw new Error(`Input '${id}' must be a direct child of a Node or a Group`);
  }
  return null;
};
export namespace IO {
  export type Props = {
    name: string,
    children?: React.ReactNode
  }
  export const filter = (children: React.ReactNode) => {
    // Filter out `inputs` and `outputs` - the components aren't directly rendered,
    // they are only used to carry props
    const remainder = React.Children.toArray(children);
    const inputs = removeAll(remainder, child => is(child, "Input"))
      .map(child => (child as React.ReactElement<IO.Props>).props.name);
    const outputs = removeAll(remainder, child => is(child, "Output"))
      .map(child => (child as React.ReactElement<IO.Props>).props.name);
    return { remainder, inputs, outputs };
  }
}

export const Output = ({ name: id }: IO.Props) => {
  const parent = React.useContext(GraphContext);
  if (!parent || !["Group", "Node"].includes(parent)) {
    throw new Error(`Output '${id}' must be a direct child of a Node or a Group`);
  }
  return null;
};