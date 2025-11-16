import { Coord, Dir, Kind, Shape } from "../types/types";

export function getShapeTemplate(kind: Kind): Shape {
  const templates: Record<number, Coord[]> = {
    0: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ], // I
    1: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ], // T
    2: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ], // O
    3: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ], // S
    4: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ], // Z
    5: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ], // L
    6: [
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ], // J
  };
  return templates[kind] || [];
}

function normalizeShapes(coords: Shape) {
  const minX = Math.min(...coords.map((p) => p.x));
  const minY = Math.min(...coords.map((p) => p.y));
  return coords.map((p) => ({ x: p.x - minX, y: p.y - minY }));
}

export function rotateShape(coords: Shape, direction: Dir = "cw"): Shape {
  // 1) Normaliser
  const norm = normalizeShapes(coords);

  // 2) Bo├«te englobante
  const W = Math.max(...norm.map((p) => p.x)) + 1;
  const H = Math.max(...norm.map((p) => p.y)) + 1;

  // 3) Rotation 90┬░ dans la bo├«te
  let rotated;
  if (direction === "cw") {
    // Horaire
    rotated = norm.map(({ x, y }) => ({ x: H - 1 - y, y: x }));
  } else if (direction === "ccw") {
    // Anti-horaire
    rotated = norm.map(({ x, y }) => ({ x: y, y: W - 1 - x }));
  } else {
    throw new Error(
      "direction doit ├¬tre 'cw' (horaire) ou 'ccw' (anti-horaire)",
    );
  }

  // 4) Re-normaliser pour ├®viter des coordonn├®es n├®gatives
  return normalizeShapes(rotated);
}
