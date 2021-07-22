import React from "react";
import type { ReactNode } from "react";

type IoProps = {
  position: [number, number];
};
const Io: React.FC<IoProps> = ({ position }) => {
  const style = {
    left: `${position[0]}px`,
    top: `${position[1]}px`
  };

  return <div className="io" style={style}></div>;
};

export type Props = {
  id: string;
  position: [number, number];
  size: [number, number];
  hasInput?: boolean;
  hasOutput?: boolean;
  onMouseDown?: (id: string, evt: React.MouseEvent) => void;
};
const Node: React.FC<Props> = ({
  id,
  position,
  size,
  hasInput = false,
  hasOutput = false,
  onMouseDown = function () {},
  children
}) => {
  const style = {
    left: `${position[0]}px`,
    top: `${position[1]}px`,
    width: `${size[0]}px`,
    height: `${size[1]}px`
  };

  return (
    <div
      id={`node:${id}`}
      className="graph-node"
      style={style}
      onMouseDown={(evt) => onMouseDown(id, evt)}
    >
      {children}
      {hasInput && <Io position={[size[0] / 2, 0]} />}
      {hasOutput && <Io position={[size[0] / 2, size[1]]} />}
    </div>
  );
};
export default Node;
