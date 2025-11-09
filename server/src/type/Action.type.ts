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
