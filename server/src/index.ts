// server.ts (exemple d'intégration Socket.IO)
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { Game } from "./class/Game";
import { Action } from "./types/types";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8081", // ou "*" pour autoriser tout le monde
    methods: ["GET", "POST"],
  },
});

const games = new Map<string, Game>();

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
      socket.emit("error", "Cannot join started game");
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

  socket.on(
    "action",
    ({ gameId, action }: { gameId: string; action: Action }) => {
      const game = games.get(gameId);
      if (game && game.handleAction(socket.id, action)) {
        io.to(gameId).emit("gameState", game.getState());
      }
    },
  );

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
      if (game.players.has(socket.id)) {
        game.removePlayer(socket.id);

        if (game.players.size === 0) {
          games.delete(gameId);
        } else {
          io.to(gameId).emit("gameState", game.getState());
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
