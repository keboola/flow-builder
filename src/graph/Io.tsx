import React from "react";
import { GraphContext } from "./context";


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
}

export const Output = ({ name: id }: IO.Props) => {
  const parent = React.useContext(GraphContext);
  if (!parent || !["Group", "Node"].includes(parent)) {
    throw new Error(`Output '${id}' must be a direct child of a Node or a Group`);
  }
  return null;
};