import type { Board } from "./Board.type";
import type { Kind } from "./Kind.type";
import type { Size } from "./Size.type";

export type GamePhase = "Playing" | "Paused" | "GameOver";

export type GameState = Readonly<{
  board: Board;
  queue: Readonly<Kind>[];
  score: number;
  lines: number;
  phase: GamePhase;
  size: Size;
}>;
