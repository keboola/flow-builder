import React, { useState, useRef, useEffect, useCallback } from "react";
import { ContainerContext } from "./context";
import { v2, processEdge, ProcessedEdge } from "./util";

export const Graph = ({ edges, children, style, calculatePath }: Graph.Props) => {
  if (!children) return null;

  const [paths, setPaths] = useState<ProcessedEdge[]>([]);

  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const containerRect = container.current!.getBoundingClientRect();
    const offset = v2(containerRect.x, containerRect.y);
    setPaths(edges.map((edge) => processEdge(container.current!, edge, offset, calculatePath)));
  }, [edges, calculatePath]);

  return (
    <ContainerContext.Provider value={container}>
      <div ref={container} data-type="graph" className="flow-builder" style={{ ...style }}>
        <svg>
          {paths.map((path) => (
            <path key={path.edge} d={path.d} />
          ))}
        </svg>
        {children}
      </div>
    </ContainerContext.Provider>
  );
};
export namespace Graph {
  export type Props = {
    edges: string[];
    children?: React.ReactNode;
    style?: React.CSSProperties;
    calculatePath?: (from: { x: number; y: number }, to: { x: number; y: number }) => string;
  };
}
