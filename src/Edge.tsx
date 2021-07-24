import React from "react";
import { calculatePath } from "./util";

type Props = {
  start: [number, number],
  end: [number, number],

  [k: string]: any
};
const Edge = React.forwardRef((
  { start, end, ...other }: Props,
  ref: React.ForwardedRef<SVGPathElement>
) => {

  return (
    <path
      ref={ref}
      d={calculatePath(start, end)}
      stroke="black"
      fill="transparent"
      {...other}
    />
  )
});

export default Edge;