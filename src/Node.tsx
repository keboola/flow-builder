import React from "react";
import type { NodeBase } from "./data";
import { bounds, classes, Id, NodeKind } from "./util";

type Props = {
  id: string,
  containerId: string,
  pos: [number, number]
  content?: any,
  nested?: NodeBase[],

  cellSize: number,
  hasInput?: boolean,
  canOutput?: boolean,
  ghost?: boolean,
  selected?: string,

  containerRef?: React.LegacyRef<HTMLDivElement>
};
class Node extends React.Component<Props> {
  render() {
    const {
      id, containerId, pos, content, nested,
      cellSize,
      hasInput, canOutput,
      ghost, selected,
      containerRef
    } = this.props;

    const style: React.CSSProperties = {
      left: `${pos[0] * cellSize}px`,
      top: `${pos[1] * cellSize}px`
    };

    if (ghost) {
      // Ghost node does not have any contents
      // its width/height must be set manually
      const originRect = bounds(Id.node(id, false), containerId)!;
      style.width = `${originRect.width}px`;
      style.height = `${originRect.height}px`;
    }

    return (
      <div
        ref={containerRef}
        id={Id.node(id, ghost)}
        className={classes({
          "graph-node": true,
          "ghost": ghost,
          "selected": id === selected
        })}
        data-type={nested !== undefined ? "group" : "node"}
        style={style}
      >
        <div className="graph-node-content">
          {
            nested?.map(child => (
              <div
                key={Id.node(child.id)}
                id={Id.node(child.id, false)}
                data-type="node"
                data-parent={id}
                className={classes({
                  "graph-node": true,
                  "nested": true,
                  "selected": child.id === selected
                })}
              >
                <div key={Id.node(child.id)} className="graph-node-content">
                  {child.content}
                </div>
              </div>
            )) ?? content
          }
        </div>
        {hasInput && !ghost && (
          <div className="io-container">
            <div id={Id.input(id)} />
          </div>
        )}
        {canOutput !== false && !ghost && (
          <div className="io-container bottom">
            <div id={Id.output(id)} />
          </div>
        )}
      </div>
    );
  }
}

export default Node;
