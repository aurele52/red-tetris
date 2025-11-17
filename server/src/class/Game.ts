import { Action, Board, PieceData, PlayerData } from "../types/types";
import { Player } from "./Player";
import { applyMove } from "../domain/ApplyMove";

export type GameState = {
  id: string;
  isStarted: boolean;
  hostId: string | null;
  players: PlayerData[];
};

export class Game {
  id: string;
  players: Player[];
  hostId: string | null;
  isStarted: boolean;
  gameInterval: any;
  broadcastGameState: (gameState: GameState) => void;

  constructor(id: string, broadcastGameState: (gameState: GameState) => void) {
    this.id = id;
    this.players = [];
    this.hostId = null;
    this.isStarted = false;
    this.gameInterval = null;
    this.broadcastGameState = broadcastGameState;
  }

  addPlayer(playerId: string, playerName: string): boolean {
    if (this.isStarted) return false;
    if (this.players.length >= 2) return false;

    const player = new Player(playerId, playerName);
    this.players.push(player);

    if (!this.hostId) {
      this.hostId = playerId;
    }

    return true;
  }

  removePlayer(playerId: string): void {
    this.players = this.players.filter((player) => player.id !== playerId);
    if (this.hostId === playerId) {
      const remainingPlayers = Array.from(this.players);
      this.hostId = remainingPlayers.length > 0 ? remainingPlayers[0].id : null;
    }
    this.stop();
  }

  start(): boolean {
    if (this.isStarted || this.players.length === 0) return false;

    this.isStarted = true;
    this.players.forEach((player) => {
      player.reset();
      player.spawnPiece();
    });

    this.gameInterval = setInterval(() => {
      this.tick();
      this.broadcastGameState(this.getState());
    }, 1000);

    return true;
  }

  stop(): void {
    this.isStarted = false;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  restart(): boolean {
    this.stop();
    return this.start();
  }

  private tick(): void {
    this.players.forEach((player) => {
      if (!player.isAlive) return;

      if (!player.currentPiece) {
        player.spawnPiece();
        return;
      }

      const movedPiece = player.currentPiece.moveDown();

      if (movedPiece.isValidPosition(player.board)) {
        player.currentPiece = movedPiece;
      } else {
        player.lockPiece();
        player.spawnPiece();
        const playersArray = Array.from(this.players.values());
        if (playersArray.length === 2) {
          const [p0, p1] = playersArray;
          p0.malus = p1.cleared;
          p1.malus = p0.cleared;
        }
      }
    });

    this.checkGameOver();
  }

  private checkGameOver(): void {
    const alivePlayers = Array.from(this.players.values()).filter(
      (p) => p.isAlive,
    );
    if (this.players.length && alivePlayers.length < 2) {
      this.stop();
    }

    if (alivePlayers.length < 1) {
      this.stop();
    }
  }

  handleAction(playerId: string, action: Action): boolean {
    if (!this.isStarted) return false;

    const player =
      this.players[0].id === playerId ? this.players[0] : this.players[1];
    if (!player || !player.isAlive || !player.currentPiece) return false;
    return applyMove(player, action);
  }

  getState(): GameState {
    return {
      id: this.id,
      isStarted: this.isStarted,
      hostId: this.hostId,
      players: Array.from(this.players.values()).map((p) => p.toData()),
    };
  }
}
