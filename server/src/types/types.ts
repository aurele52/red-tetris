export type Action =
  | "MoveLeft"
  | "MoveRight"
  | "SoftDrop"
  | "RotateCW"
  | "HardDrop";
export type Board = ReadonlyArray<ReadonlyArray<Kind>>;
export type Coord = { x: number; y: number };
export type Kind = Readonly<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>;

export const KIND_I: Kind = 0 as Kind;
export const KIND_T: Kind = 1 as Kind;
export const KIND_O: Kind = 2 as Kind;
export const KIND_S: Kind = 3 as Kind;
export const KIND_Z: Kind = 4 as Kind;
export const KIND_L: Kind = 5 as Kind;
export const KIND_J: Kind = 6 as Kind;
export const EMPTY_KIND: Kind = 7 as Kind;
export const MALUS_KIND: Kind = 8 as Kind;
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
  malus: number;
}>;
