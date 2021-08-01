import React from "react";

export class Vector2 {
  constructor(public x: number, public y: number) {}

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  subtract(value: Vector2): Vector2 {
    return new Vector2(this.x - value.x, this.y - value.y);
  }
  /** Euclidean distance between `this` and `that` */
  distance(that: Vector2) {
    const dx = that.x - this.x;
    const dy = that.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** Apply the vector as CSS size style */
  applyAsSize(el: HTMLElement) {
    el.style.width = `${this.x}px`;
    el.style.height = `${this.y}px`;
  }
  /** Apply the vector as CSS position style */
  applyAsPosition(el: HTMLElement) {
    el.style.left = `${this.x}px`;
    el.style.top = `${this.y}px`;
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }

  /** Assumes `style.width` and `style.height` are in `px` */
  static fromElementSize(el: HTMLElement): Vector2 {
    const style = getComputedStyle(el);
    return new Vector2(parseInt(style.width, 10), parseInt(style.height, 10));
  }
  /** Assumes `style.left` and `style.top` are in `px` */
  static fromElementPosition(el: HTMLElement): Vector2 {
    const style = getComputedStyle(el);
    return new Vector2(parseInt(style.left, 10), parseInt(style.top, 10));
  }
}
/**
 * Shorthand for `new Vector2(x, y)`
 */
export const v2 = (x: number = 0, y: number = 0) => new Vector2(x, y);
/**
 * Creates a `Vector2` from an array with two elements
 */
v2.from = (array: [number, number]) => new Vector2(array[0], array[1]);
/**
 * Calculates the midpoint of `a` and `b`
 */
v2.pmid = (a: Vector2, b: Vector2) => new Vector2((a.x + b.x) / 2, (a.y + b.y) / 2);
/**
 * Calculates the midpoint of `rect`
 */
v2.rectMid = (rect: DOMRect) => new Vector2(rect.x + rect.width / 2, rect.y + rect.height / 2);

/**
 * Transform a 2D position into a CSS 2D position in pixels
 */
export const pos = (value: [number, number]) => ({
  left: `${value[0]}px`,
  top: `${value[1]}px`
});

/**
 * Attempts to find the type name of `node`
 *
 * * If `node` is a string, returns `Text`
 * * If `node` has the property `type`, and
 *   * `node.type` is a string, returns it
 *   * `node.type` is a class or function, returns `node.type.name`
 *
 * e.g.
 * ```jsx
 * getTypeName(<div />) === "div"
 * getTypeName(<MyComponent />) === "MyComponent"
 * getTypeName("test") === "Text"
 * ```
 */
const getTypeName = (node: any) => {
  if (typeof node === "string") return "Text";
  if ("type" in node) {
    if (typeof node.type === "string") return node.type;
    if (typeof node.type === "function") return node.type.name;
  }
  return null;
};

/**
 * Runtime check to ensure `props.children` contain valid elements.
 *
 * @param parent Name of the parent element used in the error message
 * @param children Any valid React element (Text, Fragment, Portal, Component...)
 * @param nameList A list of type names
 *
 * * If `behavior` is `inclusive`, then `children` must only contain elements
 *   whose type names are in `nameList`
 * * If `behavior` is `exclusive`, then `children` must contain elements
 *   whose type names are not in `nameList`
 */
export const validateChildren = (
  parent: string,
  children: any,
  nameList: string[],
  behavior: "inclusive" | "exclusive"
) => {
  React.Children.map(children, (child) => {
    const typeName = getTypeName(child);
    if (
      !typeName ||
      (behavior === "inclusive" && !nameList.includes(typeName)) ||
      (behavior === "exclusive" && nameList.includes(typeName))
    )
      throw new Error(`Element of type '${typeName}' may not appear in '${parent}'`);
  });
};

/**
 * Joins the fragments of a tagged template literal
 */
const joinTemplateFragments = (strings: TemplateStringsArray, values: any[]) => {
  // Optimization for when there is only a single fragment
  if (values.length === 0) return strings[0];
  // This concatenates `strings` and stringified `values` in an alternating way
  let out = "";
  let strIdx = 0,
    valIdx = 0,
    totalLen = strings.length + values.length,
    toggle = true;
  while (strIdx + valIdx < totalLen) {
    if (toggle) out += strings[strIdx++];
    else out += String(values[valIdx++]);
    toggle = !toggle;
  }
  return out;
};

/**
 * Query selector shorthand
 *
 * Usage:
 * ```js
 * const el1 = $`div.test[x='${10*2+5}']`();
 * // or with a different root
 * const el2 = $`div.test[x='${10*2+5}']`(document.getElementById("root"));
 * ```
 */
export const $ = (strings: TemplateStringsArray, ...values: any[]) => {
  const selector = joinTemplateFragments(strings, values);
  return (root: ParentNode = document) => root.querySelector(selector);
};

/**
 * Conditional classes
 *
 * Usage:
 * ```jsx
 * <element
 *   style={classes({
 *     "disabled": isDisabled
 *   })}
 * />
 * ```
 */
export const classes = (v: Record<string, boolean>) =>
  Object.entries(v)
    .filter(([_, append]) => append)
    .map(([name]) => name)
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
  line: (start: Vector2, end: Vector2) => `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
  bezier: (start: Vector2, end: Vector2) => {
    const mid = v2.pmid(start, end);
    return (
      "" +
      `M ${start.x} ${start.y} ` +
      `Q ${start.x} ${start.y + (end.y - start.y) / 2}, ${mid.x} ${mid.y} ` +
      `T ${end.x} ${end.y}`
    );
  }
};

/**
 * Remove from `array` the first item for which `predicate` is `true`,
 * returning the removed item, or `null` if not found.
 *
 * This mutates `array` in-place. If that is undesirable,
 * copy your array first:
 * ```js
 * remove([...myArray], v => v % 2 === 0)
 * ```
 */
export const remove = <T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): T | null => {
  let removed: T | null = null;
  for (let i = 0, len = array.length; i < len; ++i) {
    if (removed) array[i - 1] = array[i];
    else if (predicate(array[i], i, array)) removed = array[i];
  }
  if (removed) array.length -= 1;
  return removed;
};

/**
 * Remove from `array` all items for which `predicate` is `true`,
 * returning the removed items, or `null` if not found.
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
