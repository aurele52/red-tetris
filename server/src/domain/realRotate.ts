import { Piece } from "../class/Piece";
import {
  Board,
  Dir,
  EMPTY_KIND,
  Kind,
  KIND_I,
  KIND_O,
  Rotation,
} from "../types/types";
import { rotateShape } from "./shape";

function isInsideBoard(board: Board, x: number, y: number): boolean {
  const height = board.length;
  const width = board[0]?.length ?? 0;
  return x >= 0 && x < width && y >= 0 && y < height;
}

export function collides(board: Board, piece: Piece): boolean {
  for (const c of piece.shape) {
    const bx = piece.x + c.x;
    const by = piece.y + c.y;

    // en dehors du board => collision
    if (!isInsideBoard(board, bx, by)) return true;

    // case occup├®e (non vide) => collision
    if (board[by][bx] !== EMPTY_KIND) return true;
  }
  return false;
}

type Kick = { dx: number; dy: number };

// --- JLSTZ kicks (toutes les pi├¿ces sauf I & O) ---
const JLSTZ_KICKS: Record<string, Kick[]> = {
  // 0 -> R (0 -> 1)
  "0>1": [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 0, dy: 2 },
    { dx: -1, dy: 2 },
  ],
  // R -> 0 (1 -> 0)
  "1>0": [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: -2 },
    { dx: 1, dy: -2 },
  ],
  // R -> 2 (1 -> 2)
  "1>2": [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: -2 },
    { dx: 1, dy: -2 },
  ],
  // 2 -> R (2 -> 1)
  "2>1": [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 0, dy: 2 },
    { dx: -1, dy: 2 },
  ],
  // 2 -> L (2 -> 3)
  "2>3": [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: -1 },
    { dx: 0, dy: 2 },
    { dx: 1, dy: 2 },
  ],
  // L -> 2 (3 -> 2)
  "3>2": [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: -2 },
    { dx: -1, dy: -2 },
  ],
  // L -> 0 (3 -> 0)
  "3>0": [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: -2 },
    { dx: -1, dy: -2 },
  ],
  // 0 -> L (0 -> 3)
  "0>3": [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: -1 },
    { dx: 0, dy: 2 },
    { dx: 1, dy: 2 },
  ],
};

// --- I kicks ---
const I_KICKS: Record<string, Kick[]> = {
  // 0 -> R (0 -> 1)
  "0>1": [
    { dx: 0, dy: 0 },
    { dx: -2, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -2, dy: 1 },
    { dx: 1, dy: -2 },
  ],
  // R -> 0 (1 -> 0)
  "1>0": [
    { dx: 0, dy: 0 },
    { dx: 2, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 2, dy: -1 },
    { dx: -1, dy: 2 },
  ],
  // R -> 2 (1 -> 2)
  "1>2": [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 2, dy: 0 },
    { dx: -1, dy: -2 },
    { dx: 2, dy: 1 },
  ],
  // 2 -> R (2 -> 1)
  "2>1": [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -2, dy: 0 },
    { dx: 1, dy: 2 },
    { dx: -2, dy: -1 },
  ],
  // 2 -> L (2 -> 3)
  "2>3": [
    { dx: 0, dy: 0 },
    { dx: 2, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 2, dy: -1 },
    { dx: -1, dy: 2 },
  ],
  // L -> 2 (3 -> 2)
  "3>2": [
    { dx: 0, dy: 0 },
    { dx: -2, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -2, dy: 1 },
    { dx: 1, dy: -2 },
  ],
  // L -> 0 (3 -> 0)
  "3>0": [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -2, dy: 0 },
    { dx: 1, dy: 2 },
    { dx: -2, dy: -1 },
  ],
  // 0 -> L (0 -> 3)
  "0>3": [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 2, dy: 0 },
    { dx: -1, dy: -2 },
    { dx: 2, dy: 1 },
  ],
};

export function getKicks(kind: Kind, from: Rotation, to: Rotation): Kick[] {
  // O : pas de kicks complexes ÔåÆ (0,0) uniquement
  if (kind === KIND_O) {
    return [{ dx: 0, dy: 0 }];
  }

  const key = `${from}>${to}`;
  if (kind === KIND_I) {
    return I_KICKS[key] ?? [{ dx: 0, dy: 0 }];
  }

  // J, L, S, T, Z
  return JLSTZ_KICKS[key] ?? [{ dx: 0, dy: 0 }];
}

function nextRotation(current: Rotation, dir: Dir): Rotation {
  if (dir === "cw") {
    return ((current + 1) % 4) as Rotation; // +1 modulo 4
  } else {
    return ((current + 3) % 4) as Rotation; // -1 modulo 4
  }
}

/**
 * Rotation SRS "compl├¿te" :
 * - choisit l'orientation cible (0/1/2/3),
 * - applique la rotation g├®om├®trique sur la shape,
 * - essaye tous les kicks SRS associ├®s,
 * - renvoie la nouvelle pi├¿ce si une position est valide,
 * - sinon renvoie la pi├¿ce d'origine (rotation ├®choue).
 */
export function realRotate(piece: Piece, dir: Dir, board: Board): Piece {
  const from = piece.rotation;
  const to = nextRotation(from, dir);

  // Cas sp├®cial O : visuellement, tourner ne change rien ├á la forme.
  // On applique juste la nouvelle rotation + test collision (sans kicks fancy).
  if (piece.kind === KIND_O) {
    const kicks = getKicks(piece.kind, from, to); // ici [ {0,0} ]
    for (const { dx, dy } of kicks) {
      const candidate: Piece = new Piece(
        KIND_O,
        piece.x + dx,
        piece.y + dy,
        to,
        piece.shape,
      );
      if (!collides(board, candidate)) {
        return candidate;
      }
    }
    return piece;
  }

  // Shape g├®om├®triquement rotat├®e (ta fonction)

  const kicks = getKicks(piece.kind, from, to);
  const rotatedShape = rotateShape(piece.shape, dir);

  for (const { dx, dy } of kicks) {
    const candidate: Piece = new Piece(
      piece.kind,
      piece.x + dx,
      piece.y + dy,
      to,
      rotatedShape,
    );
    if (!collides(board, candidate)) {
      return candidate;
    }
  }

  // Tous les kicks ├®chouent ÔåÆ rotation impossible
  return piece;
}
