import type { Kind } from "./types";

export function removeOneNext(next: Kind[]): Kind[] {
  return next.slice(1);
}
