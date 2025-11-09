import type { Board } from "./types/Board.type";
import type { GameState } from "./types/GameState.type";
import type { Piece } from "./types/Piece.type";
import type { Size } from "./types/Size.type";

export function canStay(size: Size, board: Board, piece: Piece): boolean {
  return piece.shape.every((cell) =>
    isOk(size, board, cell.x + piece.x, cell.y + piece.y),
  );
}
export function inBounds(size: Size, x: number, y: number): boolean {
  return x >= 0 && x < size.width && y >= 0 && y < size.height;
}
export function isOk(size: Size, board: Board, x: number, y: number): boolean {
  return inBounds(size, x, y) && isFree(board, x, y);
}
export function movePiece(piece: Piece, dx: number, dy: number) {
  return { ...piece, x: piece.x + dx, y: piece.y + dy };
}

export function visibleBoard(state: GameState): Board {
  return addPieceBoard(state.board, state.activePiece);
}

export function canMoveLeft(state: GameState): boolean {
  return canStay(state.size, state.board, movePiece(state.activePiece, -1, 0));
}

export function canMoveRight(state: GameState): boolean {
  return canStay(state.size, state.board, movePiece(state.activePiece, 1, 0));
}

export function canMoveDown(state: GameState): boolean {
  return canStay(state.size, state.board, movePiece(state.activePiece, 0, 1));
}
export function isPartOfPiece(piece: Piece, x: number, y: number): boolean {
  return piece.shape.some(
    (cell) => cell.x + piece.x === x && cell.y + piece.y === y,
  );
}

export function addPieceBoard(board: Board, piece: Piece): Board {
  return board.map((row, rowI) =>
    row.map((cell, cellI) =>
      isPartOfPiece(piece, cellI, rowI) ? piece.kind : cell,
    ),
  );
}

export function isFree(board: Board, x: number, y: number): boolean {
  return board[y][x] === 7;
}
