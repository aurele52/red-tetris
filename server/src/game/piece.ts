import { newShape, rotateShape } from "./shapes";
import type { Dir, Kind, Piece } from "./types";

export function movePiece(piece: Piece, dx: number, dy: number): Piece {
  return { ...piece, x: piece.x + dx, y: piece.y + dy };
}

export function rotatePiece(piece: Piece, dir: Dir): Piece {
  return { ...piece, shape: rotateShape(piece.shape, dir) };
}

export function newPiece(kind: Kind): Piece {
  return { kind, shape: newShape(kind), x: 0, y: 0 };
}
