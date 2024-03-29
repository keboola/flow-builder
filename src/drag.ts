import { useCallback, useEffect, useState } from "react";
import { v2, Vector2, findParent } from "./util";

export type DragEventHandler = (position: [number, number], client?: [number, number]) => void;
export function useDrag({
  onDragStart,
  onDragMove,
  onDragEnd,
  onSelect
}: {
  onDragStart?: DragEventHandler;
  onDragMove?: DragEventHandler;
  onDragEnd?: DragEventHandler;
  onSelect?: () => void;
}) {
  const deps = [onDragStart, onDragMove, onDragEnd, onSelect];

  // not using setState here intentionally - updating this state should not trigger re-rendering
  const [dragState] = useState<{
    start: Vector2 | null;
    current: Vector2 | null;
    node: HTMLElement | null;
    container: HTMLElement | null;
  }>({
    start: null,
    current: null,
    node: null,
    container: null
  });

  const offset = () =>
    dragState.container ? v2.offsetOf(dragState.container.getBoundingClientRect()) : v2();

  useEffect(() => {
    const onMouseMove = (evt: MouseEvent) => {
      if (!dragState.start) return;
      evt.preventDefault();
      const mpos = v2.from(evt);
      const rmpos = mpos.subtract(offset());
      if (dragState.current) {
        dragState.current = rmpos;
        onDragMove?.(rmpos.array(), mpos.array());
      } else if (dragState.start.dist(mpos) > 20) {
        dragState.current = rmpos;
        onDragStart?.(rmpos.array());
      }
    };

    const onMouseUp = (evt: MouseEvent) => {
      if (dragState.current || dragState.start) evt.preventDefault();
      if (dragState.current) onDragEnd?.(v2.from(evt).subtract(offset()).array());
      else if (dragState.start) onSelect?.();
      dragState.start = null;
      dragState.current = null;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, deps);

  return [
    useCallback((ref: HTMLElement | null) => {
      if (!ref || dragState.node === ref) return;
      dragState.node = ref;
      dragState.container = findParent(
        ref,
        (node) =>
          node.tagName.toLowerCase() === "div" &&
          node.dataset.type === "graph" &&
          node.classList.contains("flow-builder")
      );
    }, deps),
    useCallback((evt: React.MouseEvent) => {
      if (evt.button !== 0) return;
      dragState.start = v2(evt.clientX, evt.clientY);
    }, deps)
  ] as const;
}
