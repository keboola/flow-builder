export class Vector2 {
  constructor(public x: number, public y: number) {}

  subtract(value: Vector2): Vector2 {
    return new Vector2(this.x - value.x, this.y - value.y);
  }

  dist(that: Vector2): number {
    return Math.hypot(that.x - this.x, that.y - this.y);
  }

  toString() {
    return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}]`;
  }

  css() {
    return { left: `${this.x}px`, top: `${this.y}px` };
  }

  array(): [number, number] {
    return [this.x, this.y];
  }
}
/**
 * Shorthand for `new Vector2(x, y)`
 */
export const v2 = (x: number = 0, y: number = 0) => new Vector2(x, y);
v2.from = (v: [number, number] | MouseEvent) =>
  v instanceof MouseEvent ? new Vector2(v.clientX, v.clientY) : new Vector2(v[0], v[1]);
/**
 * Calculates the midpoint of `a` and `b`
 */
v2.pmid = (a: Vector2, b: Vector2) => new Vector2((a.x + b.x) / 2, (a.y + b.y) / 2);
/**
 * Calculates the midpoint of `rect`
 */
v2.rectMid = (rect: DOMRect) => new Vector2(rect.x + rect.width / 2, rect.y + rect.height / 2);
v2.offsetOf = (rect: DOMRect) => new Vector2(rect.left, rect.top);

/**
 * Conditional classes
 *
 * Usage:
 * ```jsx
 * <element
 *   style={classes(["disabled", isDisabled])}
 * />
 * ```
 */
export const classes = (...v: (string | [string, boolean])[]) =>
  v
    .map((c) => {
      if (typeof c === "string") return c;
      else return c[1] ? c[0] : null;
    })
    .filter((v) => v !== null)
    .join(" ");

/**
 * SVG path generators
 *
 * Usage:
 * ```jsx
 * <path d={path.line(v2(0, 0), v2(50, 50))} />
 * <path d={path.bezier(v2(0, 0), v2(50, 50))} />
 * ```
 */
export const path = {
  line: (start: { x: number; y: number }, end: { x: number; y: number }) =>
    `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
  bezier: (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const mid = v2.pmid(v2(start.x, start.y), v2(end.x, end.y));
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return (
      `M ${start.x} ${start.y} ` +
      `Q ${start.x - dx / 32} ${start.y + dy / 2}, ${mid.x} ${mid.y} ` +
      `T ${end.x} ${end.y}`
    );
  }
};

/**
 * Remove from `array` all items for which `predicate` is `true`,
 * returning the removed items, or `null` if not found.
 *
 * This is different from `Array.filter` in that it returns the
 * removed items, instead of the filtered array. It also removes
 * items for which the predicate is `true`, where as `filter`
 * preserves items for which the predicate is `true`.
 *
 * ```js
 * const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const even = removeAll(array, v => v % 2 === 0);
 * even; // [0, 2, 4, 6, 8]
 * array; // [1, 3, 5, 7, 9]
 * ```
 *
 * This mutates `array` in-place. If that is undesirable,
 * copy your array first:
 * ```js
 * removeAll([...myArray], v => v % 2 === 0)
 * ```
 */
export const removeAll = <T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): T[] => {
  let removed = [];
  for (let i = 0, len = array.length; i < len; ++i) {
    const item = array[i];
    if (predicate(item, i, array)) removed.push(item);
    else array[i - removed.length] = item;
  }
  array.length -= removed.length;
  return removed;
};

const EDGE_REGEX = /(.+\..+)->(.+\..+)/;

export interface ProcessedEdge {
  edge: string;
  d: string;
}
export const processEdge = (
  container: ParentNode,
  edge: string,
  offset: Vector2,
  calculatePath: (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => string = path.bezier
): ProcessedEdge => {
  const info = edge.match(EDGE_REGEX);
  if (!info) {
    throw new Error(
      `flow-builder: Invalid edge '${edge}', the format should be \`\${source}.\${output}->\${destination}.\${input}`
    );
  }

  const [src, dst] = info.slice(1);
  const from = container.querySelector(`div[data-name='${src}']`);
  const to = container.querySelector(`div[data-name='${dst}']`);
  if (!from || !to) {
    const [which, io] = from ? ["destination", "input"] : ["source", "output"];
    throw new Error(
      `flow-builder: Invalid edge '${edge}', ${which} node does not exist or has no such ${io}`
    );
  }
  if (from.parentElement!.dataset.type === "group" || to.parentElement!.dataset.type === "group") {
    const which = from.parentElement!.dataset.type === "group" ? "source" : "destination";
    throw new Error(`flow-builder: Invalid edge '${edge}', ${which} node is inside a group`);
  }

  const srcMid = v2.rectMid(from.getBoundingClientRect()).subtract(offset);
  const dstMid = v2.rectMid(to.getBoundingClientRect()).subtract(offset);
  return { edge, d: calculatePath(srcMid, dstMid) };
};

export function* walkParents(start: HTMLElement) {
  let parent = start.parentElement;
  while (parent) {
    yield parent;
    parent = parent.parentElement;
  }
}

export function findParent(start: HTMLElement, predicate: (node: HTMLElement) => boolean) {
  for (const parent of walkParents(start)) {
    if (predicate(parent)) return parent;
  }
  return null;
}
