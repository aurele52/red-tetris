import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import BoardView from "./components/Board";
import { addMalusToBoard, addPieceBoard } from "./selector";

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [joined, setJoined] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState("");
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState(null);

  const pathParts = window.location.pathname.split("/").filter(Boolean); // enlève les "" au début
  const gameId = pathParts[0];
  const playerName = pathParts[1];

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    setMyPlayerId(newSocket.id || "");

    newSocket.on("connect", () => {
      setMyPlayerId(newSocket.id || "");
    });

    newSocket.on("gameState", (state) => {
      setGameState(state);
      if (state && state.players.length > 1) {
        const alivePlayer = state.players.filter((e) => e.isAlive === true);
        if (alivePlayer.length == 1) setWinner(alivePlayer[0].name);
      }
    });

    newSocket.on("error", (message) => {
      alert(message);
      setError(message);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!gameId || !playerName) return;
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

  const handleAction = (action) => {
    if (socket) {
      socket.emit("action", { gameId, action });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
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
          handleAction("RotateCW");
          e.preventDefault();
          break;
        case " ":
          handleAction("HardDrop");
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, socket]);

  const isHost = gameState?.hostId === myPlayerId;
  if (error) return <>{error}</>;

  return (
    <div>
      <h1>Tetris Multiplayer</h1>
      {winner && <>The Last Winner is {winner}</>}

      {!joined ? (
        <div>Try Another Url</div>
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
        {gameState?.isStarted &&
          gameState?.players.map((player) => (
            <div key={player.id}>
              <p>{player.name}</p>
              <BoardView
                board={
                  player.currentPiece
                    ? addMalusToBoard(
                        addPieceBoard(player.board, player.currentPiece),
                        player.malus,
                      )
                    : addMalusToBoard(player.board, player.malus)
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
