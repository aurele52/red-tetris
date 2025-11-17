import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// 🔴 IMPORTANT : ne pas utiliser de variable top-level dans la factory
vi.mock("socket.io-client", () => {
  const handlers = new Map();

  const mockSocket = {
    id: "socket-1",
    on(event, cb) {
      const list = handlers.get(event) ?? [];
      list.push(cb);
      handlers.set(event, list);
    },
    emit: vi.fn(),
    close: vi.fn(),
    trigger(event, ...args) {
      (handlers.get(event) ?? []).forEach((cb) => cb(...args));
    },
  };

  // On stocke le mock sur globalThis pour y accéder dans les tests
  globalThis.__socketMock = mockSocket;

  return {
    io: vi.fn(() => mockSocket),
    // on peut renvoyer un type Socket bidon si besoin
    Socket: {},
  };
});

// helper pour récupérer le mock proprement
const getSocketMock = () => globalThis.__socketMock;
describe("<App /> avec WebSocket mocké", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost/game1/Alice"),
      writable: true,
    });

    vi.clearAllMocks();
  });

  it("envoie MoveLeft quand on appuie sur ArrowLeft", async () => {
    render(<App />);

    const socketMock = getSocketMock();

    const fakeGameState = {
      id: "game1",
      isStarted: true,
      hostId: "socket-1",
      players: [
        {
          id: "socket-1",
          name: "Alice",
          score: 0,
          isAlive: true,
          board: Array(20).fill(Array(10).fill(8)),
          malus: 2,
          currentPiece: {
            rotation: 0,
            kind: 3,
            shape: [
              { x: 1, y: 0 },
              { x: 2, y: 0 },
              { x: 0, y: 1 },
              { x: 1, y: 1 },
            ],
            x: 3,
            y: 3,
          },
        },
      ],
    };

    // On simule la réception du gameState
    socketMock.trigger("gameState", fakeGameState);

    // 🔹 On attend que le composant ait bien pris en compte le gameState
    await screen.findByText("Alice");

    // (optionnel mais propre) on nettoie les appels précédents (dont joinGame)
    socketMock.emit.mockClear();

    // 🔹 Maintenant on peut simuler la touche
    fireEvent.keyDown(window, { key: "ArrowLeft" });

    // 🔹 On vérifie que l'action est bien envoyée
    expect(socketMock.emit).toHaveBeenCalledWith(
      "action",
      expect.objectContaining({
        gameId: "game1",
        action: "MoveLeft",
      }),
    );

    socketMock.emit.mockClear();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(socketMock.emit).toHaveBeenCalledWith(
      "action",
      expect.objectContaining({
        gameId: "game1",
        action: "MoveRight",
      }),
    );
    socketMock.emit.mockClear();
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(socketMock.emit).toHaveBeenCalledWith(
      "action",
      expect.objectContaining({
        gameId: "game1",
        action: "RotateCW",
      }),
    );
    socketMock.emit.mockClear();
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(socketMock.emit).toHaveBeenCalledWith(
      "action",
      expect.objectContaining({
        gameId: "game1",
        action: "SoftDrop",
      }),
    );
  });
});
