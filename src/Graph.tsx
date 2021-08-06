import React, { useState, useRef, useEffect } from "react";
import { v2, processEdge, ProcessedEdge } from "./util";

export const Graph = ({ edges, children }: Graph.Props) => {
  if (!children) return null;

  const [paths, setPaths] = useState<(ProcessedEdge | null)[]>([]);

  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const containerRect = container.current!.getBoundingClientRect();
    const offset = v2(containerRect.x, containerRect.y);
    setPaths(edges.map(edge => processEdge(container.current!, edge, offset)));
  }, [edges]);

  return (
    <div ref={container} data-type="graph" className="flow-builder">
      <svg>
        {paths.map(path => (
          path && (
            <path
              key={path.edge}
              d={path.d}
            />
          )
        ))}
      </svg>
      {children}
    </div>
  );
};
export namespace Graph {
  export type Edge = `${string}.${string}->${string}.${string}`;
  export type Props = {
    edges: Edge[],
    children?: React.ReactElement | React.ReactElement[]
  }
}