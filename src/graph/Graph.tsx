import React from "react";
import './Graph.css';
import { validateChildren, v2, processEdge, ProcessedEdge } from "./util";
import { GraphContext } from "./context";

export const Graph = ({ edges, children }: Graph.Props) => {
  if (!children) return null;

  const parent = React.useContext(GraphContext);
  if (parent !== null) {
    throw new Error(`Graph may not be nested within another Graph, Group, Node, or Input/Output`);
  }
  validateChildren("Graph", children, ["Group", "Node"], "inclusive");

  const [paths, setPaths] = React.useState<(ProcessedEdge | null)[]>([]);

  const container = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const containerRect = container.current!.getBoundingClientRect();
    const offset = v2(containerRect.x, containerRect.y);
    setPaths(edges.map(edge => processEdge(container.current!, edge, offset)));
  }, [edges]);

  return (
    <GraphContext.Provider value={"Graph"}>
      <div ref={container} data-type="graph" className="flow-graph">
        <svg className="flow-graph--svg">
          {paths.map(path => (
            path && (
              <path
                className="flow-graph--path"
                key={path.edge}
                d={path.d}
              />
            )
          ))}
        </svg>
        {children}
      </div>
    </GraphContext.Provider>
  );
};
export namespace Graph {
  export type Edge = `${string}.${string}->${string}.${string}`;
  export type Props = {
    edges: Edge[],
    children?: React.ReactElement | React.ReactElement[]
  }
}