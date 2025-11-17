import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { Game } from "./class/Game";

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
  },
});

const games = new Map();

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("joinGame", ({ gameId, playerName }) => {
    let game = games.get(gameId);

    if (!game) {
      game = new Game(gameId, (gameState) =>
        io.to(gameId).emit("gameState", gameState),
      );
      games.set(gameId, game);
    }

    if (game.addPlayer(socket.id, playerName)) {
      socket.join(gameId);
      io.to(gameId).emit("gameState", game.getState());
    } else {
      socket.emit("error", "Cannot join game server started");
    }
  });

  socket.on("startGame", ({ gameId }) => {
    const game = games.get(gameId);
    if (game && game.hostId === socket.id) {
      if (game.start()) {
        io.to(gameId).emit("gameState", game.getState());
      }
    }
  });

  socket.on("action", ({ gameId, action }) => {
    const game = games.get(gameId);
    if (game && game.handleAction(socket.id, action)) {
      io.to(gameId).emit("gameState", game.getState());
    }
  });

  socket.on("restartGame", ({ gameId }) => {
    const game = games.get(gameId);
    if (game && game.hostId === socket.id) {
      if (game.restart()) {
        io.to(gameId).emit("gameState", game.getState());
      }
    }
  });

  socket.on("disconnect", () => {
    games.forEach((game, gameId) => {
      if (game.players.find((player) => socket.id === player.id)) {
        game.removePlayer(socket.id);
        if (game.players.length === 0) {
          games.delete(gameId);
        } else {
          io.to(gameId).emit("gameState", game.getState());
        }
      }
    });
  });
});

export function start(port = process.env.PORT || 3000) {
  return httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

if (require.main === module) {
  start();
}
