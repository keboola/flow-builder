import React, { Children } from "react";
import { removeAll } from "./util";

export const filter = (children: React.ReactNode) => {
  // Filter out inputs and outputs, they only used to carry props
  // and not directly rendered
  const remainder = Children.toArray(children);
  const inputs = removeAll(remainder, (child: any) => child?.type?._$isInput).map(
    (child) => (child as React.ReactElement<IO.Props>).props
  );
  const outputs = removeAll(remainder, (child: any) => child?.type?._$isOutput).map(
    (child) => (child as React.ReactElement<IO.Props>).props
  );
  return { remainder, inputs, outputs };
};

export const Input = (props: IO.Props) => null;
export const Output = (props: IO.Props) => null;
export namespace IO {
  export type Props = {
    name: string;
    children?: React.ReactNode;
  };
}

(() => {
  // @ts-ignore
  Input["_$isInput"] = true;
  // @ts-ignore
  Output["_$isOutput"] = true;
})();
