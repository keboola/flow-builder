import React from "react";
import './Graph.css';
import { $, validateChildren, v2, path } from "./util";

const EDGE_REGEX = /([^\s]+)->([^\s]+)/;

export const Graph = ({ edges, children }: Graph.Props) => {
  if (!children) return null;
  validateChildren("Graph", children, ["Group", "Node"], "inclusive");

  const [paths, setPaths] = React.useState<{ edge: string, d: string }[]>([]);

  const container = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const containerRect = container.current!.getBoundingClientRect();
    const offset = v2(containerRect.x, containerRect.y);
    const processed = [];
    for (const edge of edges) {
      const info = edge.match(EDGE_REGEX);
      if (info) {
        const [src, dst] = info.slice(1);
        const from = $`div[data-id='${src}']`(container.current!);
        const to = $`div[data-id='${dst}']`(container.current!);
        if (!from || !to) {
          console.warn(`Invalid edge '${edge}'`);
          continue;
        }
        if (from.parentElement!.dataset.type === "group" || to.parentElement!.dataset.type === "group") return;
        const srcMid = v2.rectMid(from.getBoundingClientRect()).subtract(offset);
        const dstMid = v2.rectMid(to.getBoundingClientRect()).subtract(offset);
        processed.push({ edge, d: path.bezier(srcMid, dstMid) });
      }
    }
    setPaths(processed);
  }, [edges])

  return (
    <div ref={container} data-type="graph" className="flow-graph">
      <svg>
        {paths.map(path => (
          <path key={path.edge} d={path.d} stroke="black" fill="transparent" />
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