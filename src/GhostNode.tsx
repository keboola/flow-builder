import React, { createRef, useEffect, useRef, useState } from "react";

export type Props = {
  id: string;
  initialPosition: [number, number];
  initialOffset: [number, number];
  size: [number, number];
  scale: { x: number; y: number };
};
export default class GhostNode extends React.Component<Props> {
  private self = createRef<HTMLDivElement>();
  gridPos: [number, number];

  constructor(props: typeof GhostNode.prototype.props) {
    super(props);
    this.gridPos = [
      props.initialPosition[0] / props.scale.x,
      props.initialPosition[1] / props.scale.y
    ];
  }

  get id() {
    return this.props.id;
  }

  componentDidMount() {
    window.addEventListener("mousemove", this.onMouseMove);
  }
  componentWillUnmount() {
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  render() {
    const style = {
      left: `${this.props.initialPosition[0]}px`,
      top: `${this.props.initialPosition[1]}px`,
      width: `${this.props.size[0]}px`,
      height: `${this.props.size[1]}px`
    };
    return <div ref={this.self} className="graph-node ghost" style={style}></div>;
  }

  onMouseMove = (evt: MouseEvent) => {
    if (this.self.current) {
      // TODO: rounding mode dependant on tile quadrant
      this.gridPos[0] = Math.round(
        (evt.clientX - this.props.initialOffset[0]) / this.props.scale.x
      );
      this.gridPos[1] = Math.round(
        (evt.clientY - this.props.initialOffset[1]) / this.props.scale.y
      );
      this.self.current.style.left = `${this.gridPos[0] * this.props.scale.x}px`;
      this.self.current.style.top = `${this.gridPos[1] * this.props.scale.y}px`;
    }
  };
}
