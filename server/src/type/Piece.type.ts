import { Kind } from "./Kind.type";
import { Shape } from "./Shape.type";

export type Piece = Readonly<{
  kind: Kind;
  shape: Shape;
  x: number;
  y: number;
}>;
