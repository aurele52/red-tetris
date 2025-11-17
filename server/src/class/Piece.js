import { getShapeTemplate, rotateShape } from "../domain/shape";
import { EMPTY_KIND } from "../types/types";

export class Piece {
  kind;
  shape;
  x;
  y;
  rotation;

  constructor(kind, x = 3, y = 0, rotation = 0, shape) {
    this.kind = kind;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.shape = shape ? shape : getShapeTemplate(kind);
  }

  moveLeft() {
    return new Piece(this.kind, this.x - 1, this.y, this.rotation, this.shape);
  }

  moveRight() {
    return new Piece(this.kind, this.x + 1, this.y, this.rotation, this.shape);
  }

  moveDown() {
    return new Piece(this.kind, this.x, this.y + 1, this.rotation, this.shape);
  }

  rotate() {
    const newPiece = new Piece(
      this.kind,
      this.x,
      this.y,
      this.rotation,
      this.shape,
    );
    newPiece.rotation = (this.rotation + 1) % 4;

    newPiece.shape = rotateShape(this.shape, this.kind);
    return newPiece;
  }

  getAbsoluteCoords() {
    return this.shape.map((coord) => ({
      x: coord.x + this.x,
      y: coord.y + this.y,
    }));
  }

  isValidPosition(board) {
    const coords = this.getAbsoluteCoords();
    return coords.every(
      (coord) =>
        coord.x >= 0 &&
        coord.x < board[0].length &&
        coord.y >= 0 &&
        coord.y < board.length &&
        board[coord.y][coord.x] === EMPTY_KIND,
    );
  }

  toData() {
    return {
      kind: this.kind,
      shape: this.shape,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
    };
  }
}
