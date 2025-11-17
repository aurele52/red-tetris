import { KIND_I, KIND_O } from "../types/types";

export function getShapeTemplate(kind) {
  const templates = {
    0: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
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
export function rotateShape(coords, kind) {
  // Le carré O ne tourne pas
  if (kind === KIND_O) {
    return coords;
  }

  // Pour le I, rotation dans une grille 4x4 avec centre en (1.5, 1.5)
  if (kind === KIND_I) {
    return coords
      .map((coord) => ({
        x: 1.5 - (coord.y - 1.5),
        y: 1.5 + (coord.x - 1.5),
      }))
      .map((coord) => ({
        x: Math.round(coord.x),
        y: Math.round(coord.y),
      }));
  }

  // Pour les autres pièces (T, S, Z, L, J), rotation dans une grille 3x3 avec centre en (1, 1)
  return coords.map((coord) => ({
    x: 1 - (coord.y - 1),
    y: 1 + (coord.x - 1),
  }));
}
