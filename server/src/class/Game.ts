// Game.ts
import { Action, Board, PieceData, PlayerData } from "../types/types";
import { Player } from "./Player";
import { applyMove } from "../domain/ApplyMove";
import { Piece } from "./Piece";

type GameState = {
  id: string;
  isStarted: boolean;
  hostId: string | null;
  players: PlayerData[];
};

export class Game {
  id: string;
  players: Map<string, Player>;
  hostId: string | null;
  isStarted: boolean;
  gameInterval: any;
  broadcastGameState: (gameState: GameState) => void;

  constructor(id: string, broadcastGameState: (gameState: GameState) => void) {
    this.id = id;
    this.players = new Map();
    this.hostId = null;
    this.isStarted = false;
    this.gameInterval = null;
    this.broadcastGameState = broadcastGameState;
  }

  addPlayer(playerId: string, playerName: string): boolean {
    if (this.isStarted) return false;

    const player = new Player(playerId, playerName);
    this.players.set(playerId, player);

    if (!this.hostId) {
      this.hostId = playerId;
    }

    return true;
  }

  removePlayer(playerId: string): void {
    this.players.delete(playerId);

    if (this.hostId === playerId) {
      const remainingPlayers = Array.from(this.players.keys());
      this.hostId = remainingPlayers.length > 0 ? remainingPlayers[0] : null;
    }

    if (this.players.size === 0) {
      this.stop();
    }
  }

  start(): boolean {
    if (this.isStarted || this.players.size === 0) return false;

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
      }
    });

    this.checkGameOver();
  }

  private checkGameOver(): void {
    const alivePlayers = Array.from(this.players.values()).filter(
      (p) => p.isAlive,
    );

    if (alivePlayers.length <= 1) {
      this.stop();
    }
  }

  handleAction(playerId: string, action: Action): boolean {
    if (!this.isStarted) return false;

    const player = this.players.get(playerId);
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
