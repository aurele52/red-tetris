import type { Action } from "@reduxjs/toolkit";
import type { GameState } from "./state";
import { movePiece, newPiece, rotatePiece } from "../domain/piece";
import { addPieceBoard, canStay, clearFullLineAndDown } from "../domain/board";
import { removeOneNext } from "../domain/next";

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "MoveLeft":
      return canStay(state.size, state.board, movePiece(state.piece, -1, 0))
        ? { ...state, piece: movePiece(state.piece, -1, 0) }
        : state;
    case "MoveRight":
      return canStay(state.size, state.board, movePiece(state.piece, 1, 0))
        ? { ...state, piece: movePiece(state.piece, 1, 0) }
        : state;
    case "MoveUp":
      return { ...state, piece: movePiece(state.piece, 0, -1) };
    case "SoftDrop":
      return canStay(state.size, state.board, movePiece(state.piece, 0, 1))
        ? { ...state, piece: movePiece(state.piece, 0, 1) }
        : state;
    case "HardDrop": {
      let tmp = { ...state.piece };
      while (canStay(state.size, state.board, movePiece(tmp, 0, 1)))
        tmp = movePiece(tmp, 0, 1);
      return {
        ...state,
        piece: newPiece(state.next[0]),
        next: removeOneNext(state.next),
        board: clearFullLineAndDown(
          state.size,
          addPieceBoard(state.board, tmp),
        ),
      };
    }
    case "RotateCW":
      return { ...state, piece: rotatePiece(state.piece, "cw") };
    case "RotateCCW":
      return { ...state, piece: rotatePiece(state.piece, "ccw") };
    case "Tick": {
      return canStay(state.size, state.board, movePiece(state.piece, 0, 1))
        ? { ...state, piece: movePiece(state.piece, 0, 1) }
        : {
            ...state,
            piece: newPiece(state.next[0]),
            next: removeOneNext(state.next),
            board: clearFullLineAndDown(
              state.size,
              addPieceBoard(state.board, state.piece),
            ),
          };
    }
    case "Spawn":
      return state;
    case "LockForDebug":
      return {
        ...state,
        piece: newPiece(5),
        board: addPieceBoard(state.board, state.piece),
      };
    default:
      throw new Error();
  }
}
