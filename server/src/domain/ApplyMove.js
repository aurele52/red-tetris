export function applyMove(player, action) {
  let newPiece;
  if (!player.currentPiece) return false;
  switch (action) {
    case "MoveLeft":
      newPiece = player.currentPiece.moveLeft();
      break;
    case "MoveRight":
      newPiece = player.currentPiece.moveRight();
      break;
    case "SoftDrop":
      newPiece = player.currentPiece.moveDown();
      if (newPiece.isValidPosition(player.board)) {
        player.currentPiece = newPiece;
      } else {
        player.lockPiece();

        player.spawnPiece();
      }
      return true;
    case "RotateCW":
      newPiece = player.currentPiece.rotate();
      break;
    case "HardDrop":
      let tryTo = true;
      let toApply = null;
      newPiece = player.currentPiece.moveDown();
      while (tryTo) {
        if (newPiece.isValidPosition(player.board)) {
          toApply = newPiece;
          newPiece = toApply.moveDown();
        } else {
          tryTo = false;
        }
      }
      if (toApply) {
        player.currentPiece = toApply;
        player.lockPiece();
        player.spawnPiece();
        return true;
      }
      return false;

    default:
      return false;
  }

  if (newPiece.isValidPosition(player.board)) {
    player.currentPiece = newPiece;
    return true;
  }

  return false;
}
