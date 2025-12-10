import { Player } from "./Player.js";
import { applyMove } from "../domain/ApplyMove.js";

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
  mode;

  constructor(id, broadcastGameState) {
    this.id = id;
    this.players = [];
    this.hostId = null;
    this.isStarted = false;
    this.gameInterval = null;
    this.broadcastGameState = broadcastGameState;
    this.mode = "classic";
  }

  addPlayer(playerId, playerName) {
    if (this.isStarted) return false;

    const player = new Player(playerId, playerName, this.randq, this.mode, this);
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
    switch (this.mode) {
        case 0:
          this.players.forEach((player, id) => {
          this.players.forEach((opponnent, opponnentId) => {
          if (id != opponnentId) opponnent.malus += player.cleared;
            });
          });
        case 1:
            this.players.forEach((player, index) => {
            this.players.forEach((opponnent, opponnentIndex) => {
            if (index != opponnentIndex && player.cleared) {
              this.handleAction(opponnent.id, "RotateCW");
            }
          });
            player.cleared = 0;  
          });
    }
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

    const player = this.players.find((play) => playerId === play.id);
    if (!player || !player.isAlive || !player.currentPiece) return false;

    let test = applyMove(player, action);
    this.players.forEach((player) => {
      player.malus = 0;
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
