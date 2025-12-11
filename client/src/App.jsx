import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import BoardView from "./components/Board";
import Menu from "./components/Menu";
import Score from "./components/Score";
import { addMalusToBoard, addPieceBoard } from "./selector";
import "./App.css" 

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [joined, setJoined] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState("");
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState(null);
  const [scoreF, setScoreF] = useState(null);

  const pathParts = window.location.pathname.split("/").filter(Boolean); // enlève les "" au début
  const gameId = pathParts[0];
  const playerName = pathParts[1];

  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() =>{
    if (gameState) {
    let tmp = gameState.players.map((pl) => pl.score)
    if (JSON.stringify(tmp) !== JSON.stringify(scoreF)) {
      setScoreF(tmp);
      if (tmp.filter((m) => (m !== 0)).length !== 0) {
      setIsFlashing(true);
      setTimeout(() => {
        setIsFlashing(false);
      }, 500);
    }} }
  }, [gameState])

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
        case "s":
          console.log("S pressed");
          handleAction("Store");
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
    <div className={`flashable-container ${isFlashing ? "flash" : ""}`}>
      <header className="header">
        <h1>Tetris Multiplayer</h1>
      </header>

      {(gameState && !gameState.isStarted) && (
        <div>
          <Score
            playersScore={gameState.players.map((p) => ({
              player: p.name,
              score: p.totScore,
            }))}
          />
        </div>
      )}
  
      {!joined ? <div>Try Another Url</div> : (gameState && !gameState.isStarted)&&<Menu gameId={gameId} socket={socket} isHost={isHost}/>}

      <section className={`player-board-container ${gameState?.players.length > 1 ? 'multi-players' : ''}`}>
        {gameState?.isStarted &&
          gameState?.players.map((player) => (
            <div key={player.id} className="player-info">
              <p className="player-name">{player.name}</p>
              <p className="player-score">Score : {player.score}</p>
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
      </section>

      {gameState && !gameState.isStarted && gameState.players.length > 0 && (
        <div className="players-list">
          <h3>Players ({gameState.players.length}):</h3>
          <ul>
            {gameState.players.map((p) => (
              <p key={p.id}>
                {p.name} {p.id === gameState.hostId && "(Host)"}
              </p>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
