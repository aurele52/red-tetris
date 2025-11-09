import { Kind } from "../type/Kind.type";

export function removeOneQueue(next: Kind[]): Kind[] {
  return next.slice(1);
}
