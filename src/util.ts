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

export const bounds = (id: string, containerId?: string): DOMRect | null => {
  const clientRect = document.getElementById(id)?.getBoundingClientRect();
  if (clientRect) {
    if (containerId) {
      const containerRect = document.getElementById(containerId)?.getBoundingClientRect();
      if (containerRect) {
        return new DOMRect(
          clientRect.x - containerRect.x,
          clientRect.y - containerRect.y,
          clientRect.width,
          clientRect.height
        );
      }
    } else {
      return clientRect;
    }
  }
  return null;
};

export const toContainerRelativePos = (
  containerId: string,
  pos: [number, number]
): [number, number] => {
  const containerRect = document.getElementById(containerId)!.getBoundingClientRect();
  return [pos[0] - containerRect.left, pos[1] - containerRect.top];
};

export const clamp = (v: number, min: number, max: number) => {
  if (v > max) return max;
  if (v < min) return min;
  return v;
};

export const snap = (v: number, cell: number) => Math.round(v / cell) * cell;
export const toGrid = (v: number, cell: number) => Math.round(v / cell);

export const classes = (v: Record<string, any>) => {
  const out = [];
  for (const [name, cond] of Object.entries(v)) {
    if (!!cond) out.push(name);
  }
  return out.join(" ");
};

export const isNodeNested = (el: HTMLElement) => el.classList.contains("nested");
export const getNodeType = (el: HTMLElement) => el.dataset.type as "node" | "group" | undefined;
export const isNodeGroup = (el: HTMLElement) => el.dataset.type === "group";
export const getParentId = (el: HTMLElement) => el.dataset.parent;

export const remove = <T>(array: T[], predicate: (value: T) => boolean): T | null => {
  let removed: T | null = null;
  for (let i = 0, len = array.length; i < len; ++i) {
    if (removed) array[i - 1] = array[i];
    else if (predicate(array[i])) removed = array[i];
  }
  if (removed) array.length -= 1;
  return removed;
};

const nodeKinds = ["node", "input", "output"] as const;
export type NodeKind = typeof nodeKinds[number];
const isNodeKind = (v: any): v is NodeKind => nodeKinds.includes(v);

export interface NodeInfo {
  type: NodeKind;
  id: string;
}

export const Id = {
  node(id: string, ghost = false) {
    let out = `node:${id}`;
    if (ghost) out += ":ghost";
    return out;
  },
  input(id: string) {
    return `input:${id}`;
  },
  output(id: string) {
    return `output:${id}`;
  },
  parse(nid: string): NodeInfo | null {
    const [type, id] = nid.split(":");
    if (type && id && isNodeKind(type))
      return {
        type,
        id
      };
    else return null;
  }
} as const;
