import { Board } from "./Board.type";
import { Kind } from "./Kind.type";
import { Piece } from "./Piece.type";
import { PlayerId } from "./PlayerId.type";
import { Size } from "./Size.type";

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
