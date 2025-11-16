import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { Kind } from "./types/Kind.type";
import type { Shape } from "./types/Shape.type";
import type { Board } from "./types/Board.type";
import BoardView from "./ui/components/Board";
import { addPieceBoard } from "./selector";

type Rotation = 0 | 1 | 2 | 3;

interface PieceData {
  kind: Kind;
  shape: Shape;
  x: number;
  y: number;
  rotation: Rotation;
}

interface PlayerState {
  id: string;
  name: string;
  score: number;
  isAlive: boolean;
  board: Board;
  currentPiece: PieceData | null;
}

interface GameState {
  id: string;
  isStarted: boolean;
  hostId: string | null;
  players: PlayerState[];
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [joined, setJoined] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const pathParts = window.location.pathname.split("/").filter(Boolean); // enlève les "" au début
  const initialGameId = pathParts[0] || "game1";
  const initialPlayerName = pathParts[1] || "";
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [gameId, setGameId] = useState(initialGameId);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    setMyPlayerId(newSocket.id || "");

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setMyPlayerId(newSocket.id || "");
    });

    newSocket.on("gameState", (state: GameState) => {
      setGameState(state);
      console.log(state);

      if (state && state.players.length > 1) {
        const alivePlayer = state.players.filter((e) => e.isAlive === true);
        if (alivePlayer.length == 1) setWinner(alivePlayer[0].name);
        else setWinner(null);
      }
    });

    newSocket.on("error", (message: string) => {
      alert(message);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleJoin = () => {
    if (socket && playerName.trim()) {
      socket.emit("joinGame", { gameId, playerName });
      setJoined(true);
    }
  };
  useEffect(() => {
    if (
      socket &&
      !joined &&
      gameId.trim().length > 0 &&
      playerName.trim().length > 0
    ) {
      socket.emit("joinGame", { gameId, playerName });
      setJoined(true);
    }
  }, [socket, joined, gameId, playerName]);

  const handleStart = () => {
    if (socket) {
      socket.emit("startGame", { gameId });
    }
  };

  const handleRestart = () => {
    if (socket) {
      socket.emit("restartGame", { gameId });
    }
  };

  const handleAction = (action: string) => {
    if (socket) {
      socket.emit("action", { gameId, action });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState?.isStarted) return;

      switch (e.key) {
        case "ArrowLeft":
          handleAction("MoveLeft");
          e.preventDefault();
          break;
        case "ArrowRight":
          handleAction("MoveRight");
          e.preventDefault();
          break;
        case "ArrowDown":
          handleAction("SoftDrop");
          e.preventDefault();
          break;
        case "ArrowUp":
        case " ":
          handleAction("RotateCW");
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, socket]);

  const isHost = gameState?.hostId === myPlayerId;

  return (
    <div>
      <h1>Tetris Multiplayer</h1>
      {winner && <>The Winner is {winner}</>}

      {!joined ? (
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <button onClick={handleJoin}>Join Game</button>
        </div>
      ) : (
        <div>
          <p>
            Game ID: <strong>{gameId}</strong>
          </p>
          {isHost && (
            <div>
              <button onClick={handleStart} disabled={gameState?.isStarted}>
                Start Game
              </button>
              <button onClick={handleRestart}>Restart Game</button>
            </div>
          )}
          {!isHost && <p>Waiting for host to start...</p>}
        </div>
      )}

      <>
        {gameState?.players.map((player) => (
          <div key={player.id}>
            <p>{player.name}</p>
            <BoardView
              board={
                player.currentPiece
                  ? addPieceBoard(player.board, player.currentPiece)
                  : player.board
              }
            />
          </div>
        ))}
      </>

      {gameState && !gameState.isStarted && gameState.players.length > 0 && (
        <div>
          <h3>Players ({gameState.players.length}):</h3>
          <ul>
            {gameState.players.map((p) => (
              <li key={p.id}>
                {p.name} {p.id === gameState.hostId && "(Host)"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
