import type { Board } from "./Board.type";
import type { Kind } from "./Kind.type";
import type { Piece } from "./Piece.type";
import type { PlayerId } from "./PlayerId.type";
import type { Size } from "./Size.type";

export type GamePhase = "Waiting" | "Playing" | "Paused" | "GameOver";

export type GameState = {
  board: Board;
  activePiece: Piece;
  queue: Readonly<Kind>[];
  rngSeed: number;
  score: number;
  lines: number;
  phase: GamePhase;
  size: Size;
  players: PlayerId[];
};
