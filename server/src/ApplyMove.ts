import { addPieceBoard, canStay, clearFullLineAndDown } from "./domain/board";
import { movePiece, newPiece, rotatePiece } from "./domain/piece";
import { removeOneQueue } from "./domain/removeOneQueue";
import { Action } from "./type/Action.type";
import { GameState } from "./type/GameState.type";

export function reducerAction(state: GameState, action: Action): GameState {
  switch (action) {
    case "MoveLeft":
      return canStay(
        state.size,
        state.board,
        movePiece(state.activePiece, -1, 0),
      )
        ? { ...state, activePiece: movePiece(state.activePiece, -1, 0) }
        : state;
    case "MoveRight":
      return canStay(
        state.size,
        state.board,
        movePiece(state.activePiece, 1, 0),
      )
        ? { ...state, activePiece: movePiece(state.activePiece, 1, 0) }
        : state;
    case "MoveUp":
      return { ...state, activePiece: movePiece(state.activePiece, 0, -1) };
    case "SoftDrop":
      return canStay(
        state.size,
        state.board,
        movePiece(state.activePiece, 0, 1),
      )
        ? { ...state, activePiece: movePiece(state.activePiece, 0, 1) }
        : state;
    case "HardDrop": {
      let tmp = { ...state.activePiece };
      while (canStay(state.size, state.board, movePiece(tmp, 0, 1)))
        tmp = movePiece(tmp, 0, 1);
      return {
        ...state,
        activePiece: newPiece(state.queue[0]),
        queue: removeOneQueue(state.queue),
        board: clearFullLineAndDown(
          state.size,
          addPieceBoard(state.board, tmp),
        ),
      };
    }
    case "RotateCW":
      return { ...state, activePiece: rotatePiece(state.activePiece, "cw") };
    case "RotateCCW":
      return { ...state, activePiece: rotatePiece(state.activePiece, "ccw") };
    case "Tick": {
      return canStay(
        state.size,
        state.board,
        movePiece(state.activePiece, 0, 1),
      )
        ? { ...state, activePiece: movePiece(state.activePiece, 0, 1) }
        : {
            ...state,
            activePiece: newPiece(state.queue[0]),
            queue: removeOneQueue(state.queue),
            board: clearFullLineAndDown(
              state.size,
              addPieceBoard(state.board, state.activePiece),
            ),
          };
    }
    case "Spawn":
      return state;
    case "LockForDebug":
      return {
        ...state,
        activePiece: newPiece(5),
        board: addPieceBoard(state.board, state.activePiece),
      };
    default:
      throw new Error();
  }
}
