export type Action =
  | "MoveLeft"
  | "MoveRight"
  | "MoveUp"
  | "SoftDrop"
  | "HardDrop"
  | "RotateCW"
  | "RotateCCW"
  | "Tick"
  | "Spawn"
  | "LockForDebug"
  | "ChangeFormForDebug";

export function fromKey(key: string): Action | null {
  switch (key) {
    case "ArrowLeft":
      return "MoveLeft";
    case "ArrowRight":
      return "MoveRight";
    case "ArrowDown":
      return "SoftDrop";
    case "ArrowUp":
      return "MoveUp";
    case "x":
      return "RotateCW";
    case "z":
      return "RotateCCW";
    case " ":
      return "HardDrop";
    case "Space":
      return "HardDrop";
    case "v":
      return "LockForDebug";
    case "c":
      return "ChangeFormForDebug";
    default:
      return null;
  }
}
