// Piece.ts
import { getShapeTemplate, rotateShape } from "../domain/shape";
import {
  Kind,
  Coord,
  Rotation,
  PieceData,
  Board,
  EMPTY_KIND,
  Shape,
} from "../types/types";

export class Piece {
  kind: Kind;
  shape: Shape;
  x: number;
  y: number;
  rotation: Rotation;

  constructor(
    kind: Kind,
    x: number = 3,
    y: number = 0,
    rotation = 0 as Rotation,
    shape?: Shape,
  ) {
    this.kind = kind;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.shape = shape ? shape : getShapeTemplate(kind);
  }

  moveLeft(): Piece {
    return new Piece(this.kind, this.x - 1, this.y, this.rotation, this.shape);
  }

  moveRight(): Piece {
    return new Piece(this.kind, this.x + 1, this.y, this.rotation, this.shape);
  }

  moveDown(): Piece {
    return new Piece(this.kind, this.x, this.y + 1, this.rotation, this.shape);
  }

  rotate(): Piece {
    const newPiece = new Piece(
      this.kind,
      this.x,
      this.y,
      this.rotation,
      this.shape,
    );
    newPiece.rotation = ((this.rotation + 1) % 4) as Rotation;

    // Rotation simple (90 degrés horaire)
    newPiece.shape = rotateShape(this.shape, "cw");
    return newPiece;
  }
  // realRotate(): Piece {}

  getAbsoluteCoords(): Coord[] {
    return this.shape.map((coord) => ({
      x: coord.x + this.x,
      y: coord.y + this.y,
    }));
  }

  isValidPosition(board: Board): boolean {
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

  toData(): PieceData {
    return {
      kind: this.kind,
      shape: this.shape,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
    };
  }
}
