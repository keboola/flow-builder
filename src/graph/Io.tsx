import React from "react";
import { GraphContext } from "./context";


export const Input = ({ id }: Input.Props) => {
  const parent = React.useContext(GraphContext);
  if (!parent || !["Group", "Node"].includes(parent)) {
    throw new Error(`Input '${id}' must be a direct child of a Node or a Group`);
  }
  return null;
};
export namespace Input {
  export type Props = {
    id: string,
    children?: React.ReactNode
  };
}

export const Output = ({ id }: Input.Props) => {
  const parent = React.useContext(GraphContext);
  if (!parent || !["Group", "Node"].includes(parent)) {
    throw new Error(`Output '${id}' must be a direct child of a Node or a Group`);
  }
  return null;
};
export namespace Input {
  export type Output = {
    id: string,
    children?: React.ReactNode
  };
}