// types.ts
export type Action = "MoveLeft" | "MoveRight" | "SoftDrop" | "RotateCW";
export type Board = ReadonlyArray<ReadonlyArray<Kind>>;
export type Dir = "cw" | "ccw";
export type Coord = { x: number; y: number };
export type Kind = Readonly<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7>;
export const KIND_I: Kind = 0 as Kind;
export const KIND_O: Kind = 3 as Kind;
export const EMPTY_KIND: Kind = 7 as Kind;
export type Rotation = 0 | 1 | 2 | 3;
export type Shape = ReadonlyArray<Coord>;
export type PieceData = Readonly<{
  kind: Kind;
  shape: Shape;
  x: number;
  y: number;
  rotation: Rotation;
}>;
export type PlayerData = Readonly<{
  id: string;
  name: string;
  score: number;
  isAlive: boolean;
  board: Board;
  currentPiece: PieceData | null;
}>;
