import { emptyBoard } from "../domain/board";
import { DefaultSize } from "../domain/config";
import { newPiece } from "../domain/piece";
import type { Board, Kind, Piece, Size } from "../domain/types";

export type GamePhase = "Playing" | "Paused" | "GameOver";

export type GameState = Readonly<{
  board: Board;
  piece: Piece;
  next: Readonly<Kind>[];
  rngSeed: number;
  score: number;
  lines: number;
  phase: GamePhase;
  size: Size;
}>;

export function initialState(seed: number, size = DefaultSize): GameState {
  return {
    board: emptyBoard(size),
    piece: newPiece(1),
    next: [
      1, 2, 3, 4, 3, 4, 5, 6, 6, 1, 3, 6, 3, 5, 4, 2, 1, 3, 1, 6, 6, 4, 4, 3, 2,
      1, 3,
    ],
    rngSeed: seed,
    score: 0,
    lines: 0,
    phase: "Playing",
    size: size,
  };
}
