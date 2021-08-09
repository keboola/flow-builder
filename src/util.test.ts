import { Vector2, v2 } from "./util";

// TODO: test v2, getTypeName, validateChildren, classes, removeAll

const vector2Equals = (a: Vector2, b: Vector2) => {
  return Math.abs(b.x - a.x) < 0.00001 && Math.abs(b.y - a.y) < 0.00001;
};

describe("Vector2", () => {
  it.each([
    [v2(), v2(), v2()],
    [v2(1, 1), v2(1, 1), v2(0, 0)],
    [v2(-1, -1), v2(1, 1), v2(-2, -2)]
  ])("subtract", (a, b, expected) => {
    expect(vector2Equals(a.subtract(b), expected)).toBe(true);
  });

  it.each([
    [v2(0, 0), { left: "0px", top: "0px" }],
    [v2(10, 10), { left: "10px", top: "10px" }],
    [v2(-510, 0), { left: "-510px", top: "0px" }]
  ])("css", (v, expected) => {
    expect(v.css()).toEqual(expected);
  });
});
