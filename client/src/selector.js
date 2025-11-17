export function isPartOfPiece(piece, x, y) {
  return piece.shape.some(
    (cell) => cell.x + piece.x === x && cell.y + piece.y === y,
  );
}

export function addPieceBoard(board, piece) {
  return board.map((row, rowI) =>
    row.map((cell, cellI) =>
      isPartOfPiece(piece, cellI, rowI) ? piece.kind : cell,
    ),
  );
}
export function malusRows(malus) {
  return Array(malus).fill(Array(10).fill(8));
}

export function addMalusToBoard(board, malus) {
  return [...board.filter((row, rowI) => rowI >= malus), ...malusRows(malus)];
}
