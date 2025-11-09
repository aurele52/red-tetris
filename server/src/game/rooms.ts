import type { Board, Kind, Piece, Size } from "./types";
import { DefaultSize } from "./config";
import { emptyBoard, addPieceBoard, canStay } from "./board";
import { newPiece, movePiece, rotatePiece } from "./piece";

export type PlayerId = string;

export type GameState = {
  size: Size;
  board: Board;
  active?: Piece;
  queue: Kind[];
  players: PlayerId[]; // max 2
};

export class GameRoom {
  id: string;
  state: GameState;

  constructor(id: string, seedQueue: Kind[] = [0, 1, 2, 3, 4, 5, 6]) {
    this.id = id;
    this.state = {
      size: DefaultSize,
      board: emptyBoard(DefaultSize),
      active: undefined,
      queue: seedQueue,
      players: [],
    };
  }

  join(player: PlayerId): { joined: boolean; reason?: string } {
    if (this.state.players.includes(player)) return { joined: true };
    if (this.state.players.length >= 2)
      return { joined: false, reason: "room_full" };
    this.state.players.push(player);
    if (!this.state.active) this.spawn();
    return { joined: true };
  }

  leave(player: PlayerId) {
    this.state.players = this.state.players.filter((p) => p !== player);
  }

  snapshot() {
    return this.state;
  }

  private spawn() {
    const next = this.state.queue[0] ?? 0;
    const p = newPiece(next as Kind);
    // spawn au milieu en haut
    const x = Math.floor(this.state.size.width / 2) - 2;
    const y = 0;
    this.state.active = { ...p, x, y };
    // avance la queue
    this.state.queue = this.state.queue.slice(1).concat(next);
  }

  tickDown() {
    if (!this.state.active) return;
    const moved = movePiece(this.state.active, 0, 1);
    if (canStay(this.state.size, this.state.board, moved)) {
      this.state.active = moved;
    } else {
      // lock piece
      this.state.board = addPieceBoard(this.state.board, this.state.active);
      this.state.active = undefined;
      this.spawn();
    }
  }

  move(dir: "left" | "right") {
    if (!this.state.active) return;
    const dx = dir === "left" ? -1 : 1;
    const moved = movePiece(this.state.active, dx, 0);
    if (canStay(this.state.size, this.state.board, moved)) {
      this.state.active = moved;
    }
  }

  rotate(dir: "cw" | "ccw") {
    if (!this.state.active) return;
    const r = rotatePiece(this.state.active, dir);
    if (canStay(this.state.size, this.state.board, r)) {
      this.state.active = r;
    }
  }
}

