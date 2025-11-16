import { Piece } from "../class/Piece";
import { Player } from "../class/Player";
import { Action } from "../types/types";

export function applyMove(player: Player, action: Action): boolean {
  let newPiece: Piece;
  if (!player.currentPiece) return false;
  switch (action) {
    case "MoveLeft":
      newPiece = player.currentPiece.moveLeft();
      break;
    case "MoveRight":
      newPiece = player.currentPiece.moveRight();
      break;
    case "SoftDrop":
      newPiece = player.currentPiece.moveDown();
      if (newPiece.isValidPosition(player.board)) {
        player.currentPiece = newPiece;
      } else {
        player.lockPiece();
        player.spawnPiece();
      }
      return true;
    case "RotateCW":
      newPiece = player.currentPiece.rotate();
      break;
    default:
      return false;
  }

  if (newPiece.isValidPosition(player.board)) {
    player.currentPiece = newPiece;
    return true;
  }

  return false;
}
// export function applyMoveSolo(
//   state: GameStateSolo,
//   action: Action,
// ): GameStateSolo {
//   switch (action) {
//     case "MoveLeft":
//       return canStay(
//         state.size,
//         state.board,
//         movePiece(state.activePiece, -1, 0),
//       )
//         ? { ...state, activePiece: movePiece(state.activePiece, -1, 0) }
//         : state;
//     case "MoveRight":
//       return canStay(
//         state.size,
//         state.board,
//         movePiece(state.activePiece, 1, 0),
//       )
//         ? { ...state, activePiece: movePiece(state.activePiece, 1, 0) }
//         : state;
//     case "MoveUp":
//       return { ...state, activePiece: movePiece(state.activePiece, 0, -1) };
//     case "SoftDrop":
//       return canStay(
//         state.size,
//         state.board,
//         movePiece(state.activePiece, 0, 1),
//       )
//         ? { ...state, activePiece: movePiece(state.activePiece, 0, 1) }
//         : state.activePiece.y < 2
//           ? { ...state, board: [], phase: "GameOver" }
//           : {
//               ...state,
//               activePiece: newPiece(state.queue[0]),
//               queue: removeOneQueue(state.queue),
//               score:
//                 state.score +
//                 100 +
//                 countFullLine(addPieceBoard(state.board, state.activePiece)) *
//                   1000,
//               board: clearFullLineAndDown(
//                 state.size,
//                 addPieceBoard(state.board, state.activePiece),
//               ),
//             };
//     case "HardDrop": {
//       let tmp = { ...state.activePiece };
//       while (canStay(state.size, state.board, movePiece(tmp, 0, 1)))
//         tmp = movePiece(tmp, 0, 1);
//       if (tmp.y < 2) return { ...state, board: [], phase: "GameOver" };
//       return {
//         ...state,
//         activePiece: newPiece(state.queue[0]),
//         queue: removeOneQueue(state.queue),
//         score:
//           state.score +
//           100 +
//           countFullLine(addPieceBoard(state.board, tmp)) * 1000,
//         board: clearFullLineAndDown(
//           state.size,
//           addPieceBoard(state.board, tmp),
//         ),
//       };
//     }
//     case "RotateCW":
//       return {
//         ...state,
//         activePiece: rotatePiece(state.activePiece, "cw", state.board),
//       };
//     case "RotateCCW":
//       return {
//         ...state,
//         activePiece: rotatePiece(state.activePiece, "ccw", state.board),
//       };
//     case "Tick": {
//       return canStay(
//         state.size,
//         state.board,
//         movePiece(state.activePiece, 0, 1),
//       )
//         ? { ...state, activePiece: movePiece(state.activePiece, 0, 1) }
//         : state.activePiece.y < 2
//           ? { ...state, board: [], phase: "GameOver" }
//           : {
//               ...state,
//               activePiece: newPiece(state.queue[0]),
//               queue: removeOneQueue(state.queue),
//               score:
//                 state.score +
//                 100 +
//                 countFullLine(addPieceBoard(state.board, state.activePiece)) *
//                   1000,
//               board: clearFullLineAndDown(
//                 state.size,
//                 addPieceBoard(state.board, state.activePiece),
//               ),
//             };
//     }
//     case "Spawn":
//       return state;
//     case "LockForDebug":
//       return {
//         ...state,
//         activePiece: newPiece(5),
//         board: addPieceBoard(state.board, state.activePiece),
//       };
//     case "ChangeFormForDebug":
//       return {
//         ...state,
//       };
//     default:
//       throw new Error();
//   }
// }
