export class Vector2 {
  constructor(public x: number, public y: number) {}

  subtract(value: Vector2): Vector2 {
    return new Vector2(this.x - value.x, this.y - value.y);
  }

  dist(that: Vector2): number {
    return Math.hypot(that.x - this.x, that.y - this.y);
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

export type RefCallback<T extends Element> = (instance: T | null) => void;
export type MutableRefObject<T extends Element> = {
  current: T | null;
};
export function multiref<T extends Element>(
  ...refs: (RefCallback<T> | MutableRefObject<T> | null)[]
) {
  return (instance: T | null) => {
    for (let i = 0; i < refs.length; ++i) {
      const ref = refs[i];
      if (!ref) continue;
      if (typeof ref === "function") ref(instance);
      else ref.current = instance;
    }
  };
}

export function mouseMoveThrottle(callback: (event: MouseEvent) => void) {
  let requestID: number;

  return function (event: MouseEvent) {
    cancelAnimationFrame(requestID);
    requestID = requestAnimationFrame(() => callback(event));
  };
}
