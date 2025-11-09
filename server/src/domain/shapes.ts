import { Kind } from "../type/Kind.type";
import { Shape } from "../type/Shape.type";
import { Dir } from "../type/Dir.type";

export const shapeTemplate = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  // I
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  // pièce "3"
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

export function newShape(kind: Kind) {
  return shapeTemplate[kind].map((a) => a);
}

function normalizeShapes(coords: Shape) {
  const minX = Math.min(...coords.map((p) => p.x));
  const minY = Math.min(...coords.map((p) => p.y));
  return coords.map((p) => ({ x: p.x - minX, y: p.y - minY }));
}

export function rotateShape(coords: Shape, direction: Dir = "cw") {
  // 1) Normaliser
  const norm = normalizeShapes(coords);

  // 2) Boîte englobante
  const W = Math.max(...norm.map((p) => p.x)) + 1;
  const H = Math.max(...norm.map((p) => p.y)) + 1;

  // 3) Rotation 90° dans la boîte
  let rotated;
  if (direction === "cw") {
    // Horaire
    rotated = norm.map(({ x, y }) => ({ x: H - 1 - y, y: x }));
  } else if (direction === "ccw") {
    // Anti-horaire
    rotated = norm.map(({ x, y }) => ({ x: y, y: W - 1 - x }));
  } else {
    throw new Error(
      "direction doit être 'cw' (horaire) ou 'ccw' (anti-horaire)",
    );
  }

  // 4) Re-normaliser pour éviter des coordonnées négatives
  return normalizeShapes(rotated);
}
