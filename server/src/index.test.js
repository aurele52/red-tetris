import { io as Client } from "socket.io-client";
import { httpServer, io, start } from "./index";

describe("Socket.IO Server Tests", () => {
  let serverSocket;
  let clientSocket;
  const PORT = 3001;

  beforeAll((done) => {
    start(PORT);
    io.on("connection", (socket) => {
      serverSocket = socket;
    });

    done();
  });

  afterAll(() => {
    io.close();
    httpServer.close();
  });

  beforeEach((done) => {
    clientSocket = Client(`http://localhost:${PORT}`);
    clientSocket.on("connect", done);
  });

  afterEach(() => {
    clientSocket.disconnect();
  });

  describe("Connection", () => {
    it("should connect successfully", (done) => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    it("should receive connection on server", () => {
      expect(serverSocket).toBeDefined();
      expect(serverSocket.id).toBeDefined();
    });
  });

  describe("joinGame", () => {
    it("should create a new game and join it", (done) => {
      clientSocket.emit("joinGame", {
        gameId: "game1",
        playerName: "Player1",
      });

      clientSocket.on("gameState", (gameState) => {
        expect(gameState).toBeDefined();
        expect(gameState.players).toHaveLength(1);
        expect(gameState.players[0].name).toBe("Player1");
        expect(gameState.hostId).toBe(gameState.players[0].id);
        done();
      });
    });

    it("should allow multiple players to join the same game", (done) => {
      const client2 = Client(`http://localhost:${PORT}`);
      const gameId = "game2";

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        client2.emit("joinGame", {
          gameId,
          playerName: "Player2",
        });

        client2.once("gameState", (gameState) => {
          expect(gameState.players).toHaveLength(2);
          expect(gameState.players[0].name).toBe("Player1");
          expect(gameState.players[1].name).toBe("Player2");
          client2.disconnect();
          done();
        });
      });
    });

    it("should emit error when trying to join a started game", (done) => {
      const client2 = Client(`http://localhost:${PORT}`);
      const gameId = "game3";

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        clientSocket.emit("startGame", { gameId });

        clientSocket.once("gameState", () => {
          client2.emit("joinGame", {
            gameId,
            playerName: "Player2",
          });

          client2.once("error", (error) => {
            expect(error).toBe("Cannot join game server started");
            client2.disconnect();
            done();
          });
        });
      });
    });
  });

  describe("startGame", () => {
    it("should start the game when host requests", (done) => {
      const gameId = "game4";

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        clientSocket.emit("startGame", { gameId });

        clientSocket.once("gameState", (gameState) => {
          expect(gameState.isStarted).toBe(true);
          done();
        });
      });
    });

    it("should not start if not host", (done) => {
      const client2 = Client(`http://localhost:${PORT}`);
      const gameId = "game5";

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        client2.emit("joinGame", {
          gameId,
          playerName: "Player2",
        });

        client2.once("gameState", (initialState) => {
          client2.emit("startGame", { gameId });

          setTimeout(() => {
            expect(initialState.isStarted).toBe(false);
            client2.disconnect();
            done();
          }, 100);
        });
      });
    });
  });

  describe("action", () => {
    it("should handle player action", (done) => {
      const gameId = "game6";
      const action = "MoveLeft";

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        clientSocket.emit("startGame", { gameId });

        clientSocket.once("gameState", () => {
          clientSocket.emit("action", { gameId, action });

          clientSocket.once("gameState", (gameState) => {
            expect(gameState).toBeDefined();
            done();
          });
        });
      });
    });

    it("should handle all action types", (done) => {
      const gameId = "game7";
      const actions = [
        "MoveLeft",
        "MoveRight",
        "SoftDrop",
        "RotateCW",
        "HardDrop",
      ];
      let actionIndex = 0;

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        clientSocket.emit("startGame", { gameId });

        clientSocket.once("gameState", () => {
          const testAction = () => {
            if (actionIndex < actions.length) {
              clientSocket.emit("action", {
                gameId,
                action: actions[actionIndex],
              });
              actionIndex++;
            } else {
              done();
            }
          };

          clientSocket.on("gameState", testAction);
          testAction();
        });
      });
    });
  });

  describe("restartGame", () => {
    it("should restart the game when host requests", (done) => {
      const gameId = "game8";

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        clientSocket.emit("startGame", { gameId });

        clientSocket.once("gameState", () => {
          clientSocket.emit("restartGame", { gameId });

          clientSocket.once("gameState", (gameState) => {
            expect(gameState).toBeDefined();
            done();
          });
        });
      });
    });
  });

  describe("disconnect", () => {
    it("should handle player disconnect", (done) => {
      const client2 = Client(`http://localhost:${PORT}`);
      const gameId = "game9";

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        client2.emit("joinGame", {
          gameId,
          playerName: "Player2",
        });

        client2.once("gameState", (gameState) => {
          expect(gameState.players).toHaveLength(2);

          // IMPORTANT : on s'abonne AVANT de déconnecter client2
          clientSocket.once("gameState", (updatedState) => {
            expect(updatedState.players).toHaveLength(1);
            client2.disconnect();
            done();
          });

          client2.disconnect();
        });
      });
    });

    it("should delete game when all players disconnect", (done) => {
      const gameId = "game10";

      clientSocket.emit("joinGame", {
        gameId,
        playerName: "Player1",
      });

      clientSocket.once("gameState", () => {
        clientSocket.disconnect();

        setTimeout(() => {
          // Le jeu devrait être supprimé de la Map
          // On vérifie en essayant de rejoindre avec un nouveau client
          const client3 = Client(`http://localhost:${PORT}`);

          client3.on("connect", () => {
            client3.emit("joinGame", {
              gameId,
              playerName: "Player3",
            });

            client3.once("gameState", (gameState) => {
              // Devrait être une nouvelle partie
              expect(gameState.players).toHaveLength(1);
              client3.disconnect();
              done();
            });
          });
        }, 100);
      });
    });
  });
});
