import React from "react";
import './Graph.css';
import { $, validateChildren, v2, Vector2, path } from "./util";

const EDGE_REGEX = /(.+)->(.+)/;

interface ProcessedEdge {
  edge: Graph.Edge,
  d: string
}
const processEdge = (
  container: ParentNode,
  edge: Graph.Edge,
  offset: Vector2
): ProcessedEdge | null => {
  const info = edge.match(EDGE_REGEX);
  if (!info) {
    console.warn(`Invalid edge '${edge}', the format should be \`\${source}.\${output}->\${destination}.\${input}`);
    return null;
  }
  const [src, dst] = info.slice(1);
  const from = $`div[data-id='${src}']`(container);
  const to = $`div[data-id='${dst}']`(container);
  if (!from || !to) {
    const [which, io] = from ? ["destination", "input"] : ["source", "input"];
    console.warn(`Invalid edge '${edge}', ${which} node does not exist or has no such ${io}`);
    return null;
  }
  if (from.parentElement!.dataset.type === "group" || to.parentElement!.dataset.type === "group") {
    const which = from.parentElement!.dataset.type === "group" ? "source" : "destination";
    console.warn(`Invalid edge '${edge}', ${which} node is inside a group`);
  }
  const srcMid = v2.rectMid(from.getBoundingClientRect()).subtract(offset);
  const dstMid = v2.rectMid(to.getBoundingClientRect()).subtract(offset);
  return { edge, d: path.bezier(srcMid, dstMid) };
}

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