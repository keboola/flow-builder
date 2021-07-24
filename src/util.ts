const nodeParts = ["container", "input", "output"] as const;
function isNodePart(value: any): value is NodePart {
  return nodeParts.includes(value);
}
export type NodePart = typeof nodeParts[number];
export const nodeId = (node: string, ghost: boolean, part: NodePart): string => {
  return `node:${ghost ? "ghost:" : "real:"}${node}:${part}`;
};

nodeId.parse = (value: string): { id: string; ghost: boolean; part: NodePart } | null => {
  const components = value.split(":");
  if (components.length !== 4) return null;
  const [prefix, mode, id, part] = components;
  if (prefix !== "node" || !isNodePart(part)) return null;
  const ghost = mode === "ghost";
  return { id, ghost, part };
};

export const calculatePath = (start: [number, number], end: [number, number]) =>
  `M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`;

type AABB = {
  pos: [number, number];
  size: [number, number];
};
type Line = [[number, number], [number, number]];
export const intersects = {
  aabb(point: [number, number], box: AABB) {
    const pX = point[0];
    const pY = point[1];
    const minX = box.pos[0];
    const minY = box.pos[1];
    const maxX = box.pos[0] + box.size[0];
    const maxY = box.pos[1] + box.size[1];

    return minX < pX && maxX > pX && minY < pY && maxY > pY;
  },
  line(point: [number, number], line: Line, epsilon = 1) {
    const d1X = point[0] - line[0][0];
    const d1Y = point[1] - line[0][1];
    const d1 = Math.sqrt(d1X * d1X + d1Y * d1Y);
    const d2X = point[0] - line[1][0];
    const d2Y = point[1] - line[1][1];
    const d2 = Math.sqrt(d2X * d2X + d2Y * d2Y);
    const lineLen = distance(line[0], line[1]);

    const d = d1 + d2;
    return d >= lineLen - epsilon && d <= lineLen + epsilon;
  }
} as const;

export const distance = (a: [number, number], b: [number, number]) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.sqrt(dx * dx + dy * dy);
};

export const bounds = (id: string) => document.getElementById(id)?.getBoundingClientRect();

export const clamp = (v: number, min: number, max: number) => {
  if (v > max) return max;
  if (v < min) return min;
  return v;
};

export const snap = (v: number, cell: number) => Math.round(v / cell) * cell;
export const toGrid = (v: number, cell: number) => Math.round(v / cell);
