import { GOAL_POSITION, TRACK_SPACES } from "../data/missions";

/** Board artboard. HTML spaces use the same numbers as percentages of this box. */
export const BOARD_W = 1000;
export const BOARD_H = 700;

export type SpaceIconName =
  | "apple"
  | "carrot"
  | "leaf"
  | "drop"
  | "book"
  | "search"
  | "plate"
  | "bowl"
  | "fish"
  | "egg"
  | "bread"
  | "utensil"
  | "check"
  | "scale"
  | "list"
  | "beaker"
  | "target"
  | "heart";

export interface BoardSpaceDef {
  id: number | "start" | "goal";
  position: number;
  level: 1 | 2 | 3 | null;
  label: string;
  type: "start" | "normal" | "goal";
  /** Artboard pixel coordinates. */
  x: number;
  y: number;
  icon: SpaceIconName | null;
}

/**
 * One curved route: START → right rail (1–6) → bottom (7–12) → left rail into the top (13–18) → GOAL.
 * Add a row here, then raise TRACK_SPACES, when the track grows.
 */
const coordinates: Array<[number, number]> = [
  [812, 108],
  [900, 184],
  [922, 276],
  [918, 368],
  [882, 456],
  [800, 524],
  [690, 566],
  [570, 590],
  [450, 598],
  [330, 586],
  [230, 548],
  [160, 488],
  [122, 408],
  [112, 322],
  [128, 236],
  [188, 164],
  [275, 116],
  [370, 96],
  [465, 112],
  [600, 148],
];

function levelFor(position: number): 1 | 2 | 3 | null {
  if (position <= 0 || position > TRACK_SPACES) return null;
  if (position <= 6) return 1;
  if (position <= 12) return 2;
  return 3;
}

export const boardSpaces: BoardSpaceDef[] = coordinates.map(([x, y], position) => {
  const type = position === 0 ? "start" : position >= GOAL_POSITION ? "goal" : "normal";
  return {
    id: type === "start" ? "start" : type === "goal" ? "goal" : position,
    position,
    level: levelFor(position),
    label: type === "start" ? "START" : type === "goal" ? "GOAL" : String(position),
    type,
    x,
    y,
    icon: null,
  };
});

export function spaceByPosition(position: number): BoardSpaceDef {
  if (position >= TRACK_SPACES) return boardSpaces[GOAL_POSITION] ?? boardSpaces[boardSpaces.length - 1];
  return boardSpaces[position] ?? boardSpaces[0];
}

export function pointPercent(space: Pick<BoardSpaceDef, "x" | "y">): { x: number; y: number } {
  return {
    x: (space.x / BOARD_W) * 100,
    y: (space.y / BOARD_H) * 100,
  };
}

function smoothPath(points: Array<Pick<BoardSpaceDef, "x" | "y">>): string {
  if (points.length === 0) return "";
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return path;
}

export const trackPaths = {
  groove: smoothPath(boardSpaces),
};
