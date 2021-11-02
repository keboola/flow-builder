import React, { useCallback, useRef, useState } from "react";
import { classes, v2 } from "./util";
import { filter } from "./Io";
import { GraphContext } from "./context";
import { useEffect } from "react";

export const Group = (props: Group.Props) => {
  if (!props.children) return null;

  const { inputs, outputs, remainder: children } = filter(props.children);

  const deps = [props.onMouseEnter, props.onMouseLeave];

  const container = useRef<HTMLDivElement>(null);
  const [hovered] = useState({ value: false });
  const onMouseMove = useCallback((evt: MouseEvent) => {
    const rect = container.current?.getBoundingClientRect();
    if (!rect) return false;
    const mx = evt.clientX;
    const my = evt.clientY;
    const currentlyHovered =
      rect.x < mx && rect.y < my && rect.x + rect.width > mx && rect.y + rect.height > my;
    if (currentlyHovered !== hovered.value) {
      hovered.value = currentlyHovered;
      if (hovered.value) props.onMouseEnter?.();
      else props.onMouseLeave?.();
    }
  }, deps);
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, deps);

  return (
    <GraphContext.Provider value={{ parent: "Group" }}>
      <div
        ref={container}
        data-type="group"
        data-name={props.name}
        className={classes("flow-builder--group", [props.className as string, !!props.className])}
        style={{ ...props.style, ...(props.position ? v2.from(props.position).css() : {}) }}
      >
        <div className="flow-builder--content">{children}</div>
        <div className="flow-builder--io flow-builder--io-top">
          {inputs.map(({ name, children, style }) => (
            <div
              className="flow-builder--io-port"
              key={name}
              data-name={`${props.name}.${name}`}
              style={style}
            >
              {children}
            </div>
          ))}
        </div>
        <div className="flow-builder--io flow-builder--io-bottom">
          {outputs.map(({ name, children, style }) => (
            <div
              className="flow-builder--io-port"
              key={name}
              data-name={`${props.name}.${name}`}
              style={style}
            >
              {children}
            </div>
          ))}
        </div>
      </div>
    </GraphContext.Provider>
  );
};
export namespace Group {
  export type Props = {
    name: string;
    position?: [number, number];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    className?: string;
  };
}
