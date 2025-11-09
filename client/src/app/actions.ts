export type Action = {
  type:
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
};

export const A = {
  moveLeft(): Action {
    return { type: "MoveLeft" };
  },
  moveRight(): Action {
    return { type: "MoveRight" };
  },
  moveUp(): Action {
    return { type: "MoveUp" };
  },

  softDrop(): Action {
    return { type: "SoftDrop" };
  },
  hardDrop(): Action {
    return { type: "HardDrop" };
  },
  rotateCW(): Action {
    return { type: "RotateCW" };
  },
  rotateCCW(): Action {
    return { type: "RotateCCW" };
  },
  lockForDebug(): Action {
    return { type: "LockForDebug" };
  },
  tick(): Action {
    return { type: "Tick" };
  },
  changeFormForDebug(): Action {
    return { type: "ChangeFormForDebug" };
  },

  fromKey(key: string): Action | null {
    switch (key) {
      case "ArrowLeft":
        return A.moveLeft();
      case "ArrowRight":
        return A.moveRight();
      case "ArrowDown":
        return A.softDrop();
      case "ArrowUp":
        return A.moveUp();
      case "x":
        return A.rotateCW();
      case "z":
        return A.rotateCCW();
      case " ":
        return A.hardDrop();
      case "Space":
        return A.hardDrop();
      case "v":
        return A.lockForDebug();
      case "c":
        return A.changeFormForDebug();
      default:
        return null;
    }
  },
};
