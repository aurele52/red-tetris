// server/src/game/board.ts
import type { Board, Kind, Piece, Size } from "./types";

const EMPTY: Kind = 7 as Kind;

export function emptyBoard(size: Size): Board {
  return Array.from({ length: size.height }, () =>
    Array.from({ length: size.width }, () => EMPTY),
  );
}

export function inBounds(size: Size, x: number, y: number): boolean {
  return x >= 0 && x < size.width && y >= 0 && y < size.height;
}

export function isFree(board: Board, x: number, y: number): boolean {
  return board[y][x] === EMPTY;
}

export function isOk(size: Size, board: Board, x: number, y: number): boolean {
  return inBounds(size, x, y) && isFree(board, x, y);
}

export function canStay(size: Size, board: Board, piece: Piece): boolean {
  return piece.shape.every((cell) => {
    const x = cell.x + piece.x;
    const y = cell.y + piece.y;
    return inBounds(size, x, y) && isFree(board, x, y);
  });
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

export function removeOneLine(board: Board, line: number): Board {
  return board.filter((_, i) => i !== line);
}

export function isFullLine(line: Readonly<Kind[]>): boolean {
  return line.every((cell) => cell !== EMPTY);
}

export function isEmptyLine(line: Readonly<Kind[]>): boolean {
  return line.every((cell) => cell === EMPTY);
}

export function generateLine(size: Size): Kind[] {
  return Array.from({ length: size.width }, () => EMPTY) as Kind[];
}

export function clearFullLine(size: Size, board: Board): Board {
  return board.map((row) => (isFullLine(row) ? generateLine(size) : row));
}

export function countEmptyLine(board: Board): number {
  return board.filter((line) => isEmptyLine(line)).length;
}

export function removeEmptyLine(size: Size, board: Board): Board {
  return [
    ...Array.from({ length: countEmptyLine(board) }, () => generateLine(size)),
    ...board.filter((line) => !isEmptyLine(line)),
  ];
}

export function clearFullLineAndDown(size: Size, board: Board): Board {
  return removeEmptyLine(size, clearFullLine(size, board));
}
