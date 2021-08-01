import React from "react";
import './Graph.css';
import { validateChildren, v2, processEdge, ProcessedEdge } from "./util";

export const Graph = ({ edges, children }: Graph.Props) => {
  if (!children) return null;
  validateChildren("Graph", children, ["Group", "Node"], "inclusive");

  const [paths, setPaths] = React.useState<(ProcessedEdge | null)[]>([]);

  const container = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const containerRect = container.current!.getBoundingClientRect();
    const offset = v2(containerRect.x, containerRect.y);
    setPaths(edges.map(edge => processEdge(container.current!, edge, offset)));
  }, [edges])

  return (
    <div ref={container} data-type="graph" className="flow-graph">
      <svg>
        {paths.map(path => (
          path && <path key={path.edge} d={path.d} stroke="black" fill="transparent" />
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