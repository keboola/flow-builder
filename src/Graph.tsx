import React from "react";

export const Graph = ({ children }: Graph.Props) => {
  if (!children) return null;

  return (
    <div data-type="graph" className="flow-builder">
      {children}
    </div>
  );
};

export namespace Graph {
  export type Props = {
    children?: React.ReactNode;
  };
}
