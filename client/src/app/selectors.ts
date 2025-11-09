import { addPieceBoard, canStay } from "../domain/board";
import { movePiece } from "../domain/piece";
import type { Board } from "../domain/types";
import type { GameState } from "./state";

export function visibleBoard(state: GameState): Board {
  return addPieceBoard(state.board, state.piece);
}

export function canMoveLeft(state: GameState): boolean {
  return canStay(state.size, state.board, movePiece(state.piece, -1, 0));
}

export function canMoveRight(state: GameState): boolean {
  return canStay(state.size, state.board, movePiece(state.piece, 1, 0));
}

export function canMoveDown(state: GameState): boolean {
  return canStay(state.size, state.board, movePiece(state.piece, 0, 1));
}
