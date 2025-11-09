export type Kind = Readonly<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7>;
export type Board = ReadonlyArray<ReadonlyArray<Kind>>;
export type Coord = { x: number; y: number };
export type Shape = ReadonlyArray<Coord>;
export type Piece = Readonly<{
  kind: Kind;
  shape: Shape;
  x: number;
  y: number;
}>;
export type Dir = "cw" | "ccw";
export type Size = Readonly<{ width: number; height: number }>;
