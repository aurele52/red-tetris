import { reducerAction } from "../ApplyMove";
import { DefaultSize } from "../config/config";
import { emptyBoard, addPieceBoard, canStay } from "../domain/board";
import { newPiece } from "../domain/piece";
import { Action } from "../type/Action.type";
import { GameState } from "../type/GameState.type";
import { Kind } from "../type/Kind.type";
import { PlayerId } from "../type/PlayerId.type";

export class GameRoom {
  id: string;
  state: GameState;

  constructor(id: string, seedQueue: Kind[] = [0, 1, 2, 3, 4, 5, 6]) {
    this.id = id;
    this.state = {
      size: DefaultSize,
      board: emptyBoard(DefaultSize),
      activePiece: newPiece(3),
      queue: seedQueue,
      players: [],
      rngSeed: 0,
      score: 0,
      lines: 0,
      phase: "Waiting",
    };
  }

  join(player: PlayerId): { joined: boolean; reason?: string } {
    if (this.state.players.includes(player)) return { joined: true };
    if (this.state.players.length >= 2)
      return { joined: false, reason: "room_full" };
    this.state.players.push(player);
    if (this.state.players.length) {
      this.state.phase = "Playing";
    }
    return { joined: true };
  }

  leave(player: PlayerId) {
    this.state.players = this.state.players.filter((p) => p !== player);
  }

  snapshot() {
    return this.state;
  }

  applyAction(action: Action) {
    if (this.state.phase != "Playing") return;
    this.state = reducerAction(this.state, action);
  }
}
