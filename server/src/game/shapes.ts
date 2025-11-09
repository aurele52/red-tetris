import type { Dir, Kind, Shape } from "./types";

// 0..6 = pièces; 7 = vide sur le plateau
export const shapeTemplate: Shape[] = [
  // I — ligne horizontale de 4
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  // L
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  // J (miroir de L)
  [
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  // O (carré)
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  // S
  [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  // T
  [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  // Z
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
];

export function newShape(kind: Kind): Shape {
  return shapeTemplate[kind].map((c) => ({ ...c }));
}

function normalizeShapes(coords: Shape): Shape {
  const minX = Math.min(...coords.map((p) => p.x));
  const minY = Math.min(...coords.map((p) => p.y));
  return coords.map((p) => ({ x: p.x - minX, y: p.y - minY }));
}

export function rotateShape(coords: Shape, direction: Dir = "cw"): Shape {
  // 1) Normaliser dans une boîte englobante
  const norm = normalizeShapes(coords);

  // 2) Dimensions de la boîte
  const W = Math.max(...norm.map((p) => p.x)) + 1;
  const H = Math.max(...norm.map((p) => p.y)) + 1;

  // 3) Rotation 90° dans la boîte
  let rotated: { x: number; y: number }[];
  if (direction === "cw") {
    rotated = norm.map(({ x, y }) => ({ x: H - 1 - y, y: x }));
  } else if (direction === "ccw") {
    rotated = norm.map(({ x, y }) => ({ x: y, y: W - 1 - x }));
  } else {
    throw new Error("direction doit être 'cw' ou 'ccw'");
  }

  // 4) Re-normaliser
  return normalizeShapes(rotated);
}
