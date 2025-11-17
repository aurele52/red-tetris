import { Player } from "./Player";
import { applyMove } from "../domain/ApplyMove";

// G├®n├®rateur pseudo-al├®atoire bas├® sur une seed
function createSeededRandom(seed) {
  return function () {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export class Game {
  id;
  players;
  hostId;
  isStarted;
  gameInterval;
  broadcastGameState;

  constructor(id, broadcastGameState) {
    this.id = id;
    this.players = [];
    this.hostId = null;
    this.isStarted = false;
    this.gameInterval = null;
    this.broadcastGameState = broadcastGameState;
  }

  addPlayer(playerId, playerName) {
    if (this.isStarted) return false;

    const player = new Player(playerId, playerName, this.randq);
    this.players.push(player);

    if (!this.hostId) {
      this.hostId = playerId;
    }

    return true;
  }

  removePlayer(playerId) {
    this.players = this.players.filter((player) => player.id !== playerId);
    if (this.hostId === playerId) {
      const remainingPlayers = Array.from(this.players);
      this.hostId = remainingPlayers.length > 0 ? remainingPlayers[0].id : null;
    }
    if (this.players.length < 1) this.stop();
  }

  start() {
    let seed = Math.floor(Math.random() * 2147483646) + 1;
    if (this.isStarted || this.players.length === 0) return false;

    this.isStarted = true;
    this.players.forEach((player) => {
      player.reset();
      player.setRandom(createSeededRandom(seed));
      player.spawnPiece();
    });

    this.gameInterval = setInterval(() => {
      this.tick();
      this.broadcastGameState(this.getState());
    }, 1000);

    return true;
  }

  stop() {
    this.isStarted = false;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  restart() {
    this.stop();
    return this.start();
  }

  tick() {
    this.players.forEach((player, playerIn) => {
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
    this.players.forEach((player) => {
      player.malus = 0;
    });
    this.players.forEach((player, id) => {
      this.players.forEach((toAdd, toAddId) => {
        if (id != toAddId) toAdd.malus += player.cleared;
      });
    });

    this.checkGameOver();
  }

  checkGameOver() {
    const alivePlayers = Array.from(this.players.values()).filter(
      (p) => p.isAlive,
    );
    if (alivePlayers.length < 1) {
      this.stop();
    }
  }

  handleAction(playerId, action) {
    if (!this.isStarted) return false;

    const player =
      this.players[0].id === playerId ? this.players[0] : this.players[1];
    if (!player || !player.isAlive || !player.currentPiece) return false;
    let test = applyMove(player, action);
    this.players.forEach((player) => {
      player.malus = 0;
    });

    this.players.forEach((player, id) => {
      this.players.forEach((toAdd, toAddId) => {
        if (id != toAddId) toAdd.malus += player.cleared;
      });
    });

    this.checkGameOver();

    return test;
  }

  getState() {
    return {
      id: this.id,
      isStarted: this.isStarted,
      hostId: this.hostId,
      players: [...this.players],
    };
  }
}
