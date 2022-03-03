import React from "react";

export const Graph = ({ children, style }: Graph.Props) => {
  if (!children) return null;

  return (
    <div data-type="graph" className="flow-builder" style={{ ...style }}>
      {children}
    </div>
  );
};
export namespace Graph {
  export type Props = {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  };
}
